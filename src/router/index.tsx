import { createBrowserRouter, Navigate } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import LoginPage from "@/pages/LoginPage";
import { DashboardPage } from "@/pages/DashboardPage";
import OrdersPage from "@/pages/OrdersPage";
import SchedulingPage from "@/pages/SchedulingPage";
import CapacityPage from "@/pages/CapacityPage";
import MaterialsPage from "@/pages/MaterialsPage";
import WorkCentersPage from "@/pages/WorkCentersPage";
import RoutingsPage from "@/pages/RoutingsPage";
import UsersPage from "@/pages/UsersPage";
import AuditLogsPage from "@/pages/AuditLogsPage";
import ChangePasswordPage from "@/pages/ChangePasswordPage";
import { ProtectedRoute } from "./ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "change-password",
        element: <ChangePasswordPage />,
      },
      {
        path: "",
        element: <MainLayout />,
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
          {
            path: "materials",
            element: <MaterialsPage />,
          },
          {
            path: "work-centers",
            element: <WorkCentersPage />,
          },
          {
            path: "routings",
            element: <RoutingsPage />,
          },
          {
            path: "users",
            element: <UsersPage />,
          },
          {
            path: "audit-logs",
            element: <AuditLogsPage />,
          },
        ],
      },
    ],
  },
]);
