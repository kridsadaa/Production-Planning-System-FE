import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "./router";
import { socket, registerSocketListeners } from "./lib/socket";

function App() {
  const queryClient = useQueryClient();

  useEffect(() => {
    registerSocketListeners(queryClient);

    // Connect socket if user is already logged in
    if (localStorage.getItem("accessToken")) {
      socket.connect();
    }

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);

  return <RouterProvider router={router} />;
}

export default App;
