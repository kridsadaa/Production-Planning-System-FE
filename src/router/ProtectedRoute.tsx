import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export const ProtectedRoute = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.accessToken);

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  if (user.passwordChangeRequired && window.location.pathname !== "/change-password") {
    return <Navigate to="/change-password" replace />;
  }

  return <Outlet />;
};
