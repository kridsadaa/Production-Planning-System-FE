import { createBrowserRouter, Navigate } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import LoginPage from "@/pages/LoginPage";
import { DashboardPage } from "@/pages/DashboardPage";
import OrdersPage from "@/pages/OrdersPage";
import SchedulingPage from "@/pages/SchedulingPage";
import CapacityPage from "@/pages/CapacityPage";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <AuthLayout />,
    children: [
      {
        path: "",
        element: <LoginPage />,
      },
    ],
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "orders",
        element: <OrdersPage />,
      },
      {
        path: "scheduling",
        element: <SchedulingPage />,
      },
      {
        path: "capacity",
        element: <CapacityPage />,
      },
    ],
  },
]);
