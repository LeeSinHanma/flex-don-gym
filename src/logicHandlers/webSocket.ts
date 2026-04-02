// webSocket.ts

type CheckInCallback = (count: number) => void;

let socket: WebSocket | null = null;

export const connectCheckInsWS = (onUpdate: CheckInCallback) => {
  if (socket) return; // prevent multiple connections

  socket = new WebSocket(
    "wss://flexolutions-backend-dev.onrender.com/dashboard/check-ins-today"
  );

  socket.onopen = () => {
    console.log("✅ WebSocket connected");
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      // handle different backend formats
      if (typeof data === "number") {
        onUpdate(data);
      } else if (data.count !== undefined) {
        onUpdate(data.count);
      } else if (data.check_ins_today !== undefined) {
        onUpdate(data.check_ins_today);
      }

      console.log("📊 WS data:", data);
    } catch (err) {
      console.error("❌ Invalid WS data:", err);
    }
  };

  socket.onerror = (err) => {
    console.error("❌ WebSocket error:", err);
  };

  socket.onclose = () => {
    console.log("🔌 WebSocket closed");
    socket = null;
  };
};

export const disconnectCheckInsWS = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};