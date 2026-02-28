import { io, Socket } from "socket.io-client";

const URL = "http://localhost:3000";

export const socket: Socket = io(URL, {
  autoConnect: false,
  auth: (cb) => {
    const token = localStorage.getItem("accessToken");
    cb({ token: `Bearer ${token}` });
  },
});

socket.on("connect", () => {
  console.log("Connected to WebSocket");
});

socket.on("disconnect", () => {
  console.log("Disconnected from WebSocket");
});

socket.on("connect_error", (err) => {
  console.error("Socket Connection Error:", err.message);
});
