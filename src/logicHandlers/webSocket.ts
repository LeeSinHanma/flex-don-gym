import { baseURL } from "../api/axios";

type CheckInCallback = (count: number) => void;

let socket: WebSocket | null = null;
let pollingInterval: any = null;
let isCheckInsDisconnecting = false; // Prevents polling on intentional disconnect

let revenueSocket: WebSocket | null = null;
let revenuePollingInterval: any = null;
let isRevenueDisconnecting = false; // Prevents polling on intentional disconnect

// Derive WebSocket base URL from the shared HTTP base URL
const wsBaseURL = baseURL.replace(/^http(s?):\/\//, "ws$1://");

// ✅ WebSocket (real-time)
export const connectCheckInsWS = (onUpdate: CheckInCallback) => {
  if (socket) return;

  const token = localStorage.getItem("access_token");
  isCheckInsDisconnecting = false;
  socket = new WebSocket(`${wsBaseURL}/dashboard/check-ins-today?token=${encodeURIComponent(token ?? "")}`);

  socket.onopen = () => {
    console.log("✅ WebSocket connected");
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      if (typeof data === "number") {
        onUpdate(data);
      } else if (typeof data === "string" && !isNaN(Number(data))) {
        onUpdate(Number(data));
      } else if (data.count !== undefined) {
        onUpdate(Number(data.count));
      } else if (data.check_ins_today !== undefined) {
        onUpdate(Number(data.check_ins_today));
      } else if (
        typeof data === "object" &&
        data !== null &&
        Object.keys(data).length === 1
      ) {
        // Fallback for single-key objects
        onUpdate(Number(Object.values(data)[0]));
      }

      console.log("📊 WS data:", data);
    } catch (err) {
      console.error("❌ Invalid WS data:", err);
    }
  };

  // onerror fires BEFORE onclose — do NOT start polling here to avoid double-start
  socket.onerror = () => {
    console.log("⚠️ WS error (onclose will handle fallback)");
  };

  socket.onclose = () => {
    console.log("🔌 WebSocket closed");
    socket = null;
    // Only fallback to polling if this wasn't an intentional disconnect
    if (!isCheckInsDisconnecting) {
      startPolling(onUpdate);
    }
  };
};

// ❌ Disconnect WS
export const disconnectCheckInsWS = () => {
  isCheckInsDisconnecting = true; // Signal: don't start polling on close
  if (socket) {
    socket.close();
    socket = null;
  }
  stopPolling();
};

// ✅ Polling (fallback) — 60s interval to reduce backend load
export const startPolling = (onUpdate: CheckInCallback) => {
  if (pollingInterval) return; // prevent duplicates

  console.log("🔄 Polling started (60s interval)");

  pollingInterval = setInterval(async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${baseURL}/dashboard/check-ins-today`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "",
        },
      });

      if (res.status === 404) {
        console.warn(
          "⚠️ REST fallback route not found (404). Stopping polling to prevent endless errors.",
        );
        stopPolling();
        return;
      }

      if (res.status === 503) {
        console.info(
          "ℹ️ Render backend is likely waking up from sleep (503). Polling will continue quietly...",
        );
        return;
      }

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (typeof data === "number") {
        onUpdate(data);
      } else if (typeof data === "string" && !isNaN(Number(data))) {
        onUpdate(Number(data));
      } else if (data.count !== undefined) {
        onUpdate(Number(data.count));
      } else if (data.check_ins_today !== undefined) {
        onUpdate(Number(data.check_ins_today));
      } else if (
        typeof data === "object" &&
        data !== null &&
        Object.keys(data).length === 1
      ) {
        onUpdate(Number(Object.values(data)[0]));
      }

      console.log("📊 Polling data:", data);
    } catch (err) {
      console.error("❌ Polling error");
    }
  }, 60000); // ⏱ every 60 seconds
};

// 🛑 Stop polling
export const stopPolling = () => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
    console.log("⛔ Polling stopped");
  }
};

// ✅ WebSocket (real-time) for Revenue
export const connectRevenueWS = (onUpdate: (amount: number) => void) => {
  if (revenueSocket) return;

  const token = localStorage.getItem("access_token");
  isRevenueDisconnecting = false;
  revenueSocket = new WebSocket(`${wsBaseURL}/dashboard/revenue-today?token=${encodeURIComponent(token ?? "")}`);

  revenueSocket.onopen = () => {
    console.log("✅ Revenue WebSocket connected");
  };

  revenueSocket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      if (typeof data === "number") {
        onUpdate(data);
      } else if (typeof data === "string" && !isNaN(Number(data))) {
        onUpdate(Number(data));
      } else if (data?.amount !== undefined) {
        onUpdate(Number(data.amount));
      } else if (data?.revenue !== undefined) {
        onUpdate(Number(data.revenue));
      } else if (data?.revenue_today !== undefined) {
        onUpdate(Number(data.revenue_today));
      } else if (data?.total_revenue !== undefined) {
        onUpdate(Number(data.total_revenue));
      } else if (data?.total !== undefined) {
        onUpdate(Number(data.total));
      } else if (data?.total_price !== undefined) {
        onUpdate(Number(data.total_price));
      } else if (
        typeof data === "object" &&
        data !== null &&
        Object.keys(data).length > 0
      ) {
        const val = Object.values(data)[0];
        if (
          typeof val === "number" ||
          (typeof val === "string" && !isNaN(Number(val)))
        ) {
          onUpdate(Number(val));
        }
      }

      console.log("📊 Revenue WS data:", data);
    } catch (err) {
      console.error("❌ Invalid Revenue WS data:", err);
    }
  };

  // onerror fires BEFORE onclose — do NOT start polling here to avoid double-start
  revenueSocket.onerror = () => {
    console.log("⚠️ Revenue WS error (onclose will handle fallback)");
  };

  revenueSocket.onclose = () => {
    console.log("🔌 Revenue WebSocket closed");
    revenueSocket = null;
    // Only fallback to polling if this wasn't an intentional disconnect
    if (!isRevenueDisconnecting) {
      startRevenuePolling(onUpdate);
    }
  };
};

// ❌ Disconnect Revenue WS
export const disconnectRevenueWS = () => {
  isRevenueDisconnecting = true; // Signal: don't start polling on close
  if (revenueSocket) {
    revenueSocket.close();
    revenueSocket = null;
  }
  stopRevenuePolling();
};

// ✅ Polling (fallback) for Revenue — 60s interval to reduce backend load
export const startRevenuePolling = (onUpdate: (amount: number) => void) => {
  if (revenuePollingInterval) return; // prevent duplicates

  console.log("🔄 Revenue Polling started (60s interval)");

  revenuePollingInterval = setInterval(async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${baseURL}/dashboard/revenue-today`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "",
        },
      });

      if (res.status === 404) {
        console.warn(
          "⚠️ Revenue REST fallback route not found (404). Stopping polling to prevent endless errors.",
        );
        stopRevenuePolling();
        return;
      }

      if (res.status === 503) {
        console.info(
          "ℹ️ Revenue backend is likely waking up (503). Polling will continue...",
        );
        return;
      }

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (typeof data === "number") {
        onUpdate(data);
      } else if (typeof data === "string" && !isNaN(Number(data))) {
        onUpdate(Number(data));
      } else if (data?.amount !== undefined) {
        onUpdate(Number(data.amount));
      } else if (data?.revenue !== undefined) {
        onUpdate(Number(data.revenue));
      } else if (data?.revenue_today !== undefined) {
        onUpdate(Number(data.revenue_today));
      } else if (data?.total_revenue !== undefined) {
        onUpdate(Number(data.total_revenue));
      } else if (data?.total !== undefined) {
        onUpdate(Number(data.total));
      } else if (data?.total_price !== undefined) {
        onUpdate(Number(data.total_price));
      } else if (
        typeof data === "object" &&
        data !== null &&
        Object.keys(data).length > 0
      ) {
        const val = Object.values(data)[0];
        if (
          typeof val === "number" ||
          (typeof val === "string" && !isNaN(Number(val)))
        ) {
          onUpdate(Number(val));
        }
      }

      console.log("📊 Revenue Polling data:", data);
    } catch (err) {
      // Just log less frequently
    }
  }, 60000); // ⏱ every 60 seconds
};

// 🛑 Stop Revenue polling
export const stopRevenuePolling = () => {
  if (revenuePollingInterval) {
    clearInterval(revenuePollingInterval);
    revenuePollingInterval = null;
    console.log("⛔ Revenue Polling stopped");
  }
};

