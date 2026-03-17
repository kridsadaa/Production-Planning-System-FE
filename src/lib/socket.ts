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
  // Orders
  socket.on("orderStatusUpdated", () => {
    queryClient.invalidateQueries({ queryKey: ["orders"] });
    queryClient.invalidateQueries({ queryKey: ["metrics"] });
  });
  
  // Work Centers / Machines
  socket.on("machineStatusUpdated", () => {
    queryClient.invalidateQueries({ queryKey: ["work-centers"] });
    queryClient.invalidateQueries({ queryKey: ["capacity"] });
  });
  
  // Scheduling
  socket.on("scheduleUpdated", () => {
    queryClient.invalidateQueries({ queryKey: ["scheduling"] });
  });
  
  socket.on("scheduleReordered", () => {
    queryClient.invalidateQueries({ queryKey: ["scheduling"] });
  });
  
  // Capacity alert
  socket.on("machineOverloadAlert", () => {
    queryClient.invalidateQueries({ queryKey: ["capacity"] });
    queryClient.invalidateQueries({ queryKey: ["metrics"] });
  });
  
  // Progress / Production logs
  socket.on("progressUpdated", () => {
    queryClient.invalidateQueries({ queryKey: ["orders"] });
  });
}
