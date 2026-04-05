type CheckInCallback = (count: number) => void;

let socket: WebSocket | null = null;
let pollingInterval: any = null;

let revenueSocket: WebSocket | null = null;
let revenuePollingInterval: any = null;

// ✅ WebSocket (real-time)
export const connectCheckInsWS = (onUpdate: CheckInCallback) => {
  if (socket) return;

  socket = new WebSocket(
    "wss://flexolutions-backend-dev.onrender.com/dashboard/check-ins-today"
  );

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
      } else if (typeof data === "object" && data !== null && Object.keys(data).length === 1) {
        // Fallback for single-key objects
        onUpdate(Number(Object.values(data)[0]));
      }

      console.log("📊 WS data:", data);
    } catch (err) {
      console.error("❌ Invalid WS data:", err);
    }
  };

  socket.onerror = () => {
    console.log("⚠️ WS error → fallback to polling");
    startPolling(onUpdate);
  };

  socket.onclose = () => {
    console.log("🔌 WebSocket closed → fallback to polling");
    socket = null;
    startPolling(onUpdate);
  };
};

// ❌ Disconnect WS
export const disconnectCheckInsWS = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
  stopPolling();
};

// ✅ Polling (fallback)
export const startPolling = (onUpdate: CheckInCallback) => {
  if (pollingInterval) return; // prevent duplicates

  console.log("🔄 Polling started");

  pollingInterval = setInterval(async () => {
    try {
      const res = await fetch(
        "https://flexolutions-backend-dev.onrender.com/dashboard/check-ins-today"
      );
      
      if (res.status === 404) {
        console.warn("⚠️ REST fallback route not found (404). Stopping polling to prevent endless errors.");
        stopPolling();
        return;
      }

      if (res.status === 503) {
        console.info("ℹ️ Render backend is likely waking up from sleep (503). Polling will continue quietly...");
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
      } else if (typeof data === "object" && data !== null && Object.keys(data).length === 1) {
        onUpdate(Number(Object.values(data)[0]));
      }

      console.log("📊 Polling data:", data);
    } catch (err) {
      // Just log less frequently to keep console clean
      console.error("❌ Polling error (skipping log to keep console clean)");
    }
  }, 15000); // ⏱ every 15 seconds instead of 5
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

  revenueSocket = new WebSocket(
    "wss://flexolutions-backend-dev.onrender.com/dashboard/revenue-today"
  );

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
      } else if (typeof data === "object" && data !== null && Object.keys(data).length > 0) {
        const val = Object.values(data)[0];
        if (typeof val === "number" || (typeof val === "string" && !isNaN(Number(val)))) {
          onUpdate(Number(val));
        }
      }

      console.log("📊 Revenue WS data:", data);
    } catch (err) {
      console.error("❌ Invalid Revenue WS data:", err);
    }
  };

  revenueSocket.onerror = () => {
    console.log("⚠️ Revenue WS error → fallback to polling");
    startRevenuePolling(onUpdate);
  };

  revenueSocket.onclose = () => {
    console.log("🔌 Revenue WebSocket closed → fallback to polling");
    revenueSocket = null;
    startRevenuePolling(onUpdate);
  };
};

// ❌ Disconnect Revenue WS
export const disconnectRevenueWS = () => {
  if (revenueSocket) {
    revenueSocket.close();
    revenueSocket = null;
  }
  stopRevenuePolling();
};

// ✅ Polling (fallback) for Revenue
export const startRevenuePolling = (onUpdate: (amount: number) => void) => {
  if (revenuePollingInterval) return; // prevent duplicates

  console.log("🔄 Revenue Polling started");

  revenuePollingInterval = setInterval(async () => {
    try {
      const res = await fetch(
        "https://flexolutions-backend-dev.onrender.com/dashboard/revenue-today"
      );
      
      if (res.status === 404) {
        console.warn("⚠️ Revenue REST fallback route not found (404). Stopping polling to prevent endless errors.");
        stopRevenuePolling();
        return;
      }

      if (res.status === 503) {
        console.info("ℹ️ Revenue backend is likely waking up (503). Polling will continue...");
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
      } else if (typeof data === "object" && data !== null && Object.keys(data).length > 0) {
        const val = Object.values(data)[0];
        if (typeof val === "number" || (typeof val === "string" && !isNaN(Number(val)))) {
          onUpdate(Number(val));
        }
      }

      console.log("📊 Revenue Polling data:", data);
    } catch (err) {
      // Just log less frequently
    }
  }, 15000); // ⏱ every 15 seconds instead of 5
};

// 🛑 Stop Revenue polling
export const stopRevenuePolling = () => {
  if (revenuePollingInterval) {
    clearInterval(revenuePollingInterval);
    revenuePollingInterval = null;
    console.log("⛔ Revenue Polling stopped");
  }
};