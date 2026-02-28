import { io, Socket } from "socket.io-client";
import type { QueryClient } from "@tanstack/react-query";

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

/**
 * Register real-time socket listeners that invalidate React Query caches.
 * Call once after QueryClient is initialized (e.g. in App.tsx).
 */
export function registerSocketListeners(queryClient: QueryClient) {
  // Order created / updated / deleted → refresh orders table
  socket.on("orderStatusUpdated", (data) => {
    console.log("[Socket] orderStatusUpdated:", data);
    queryClient.invalidateQueries({ queryKey: ["orders"] });
  });

  // Work-center status changed → refresh work-centers table
  socket.on("machineStatusUpdated", (data) => {
    console.log("[Socket] machineStatusUpdated:", data);
    queryClient.invalidateQueries({ queryKey: ["work-centers"] });
  });
}
