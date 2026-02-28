import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { MainLayout } from "@/layouts/MainLayout";
import LoginPage from "@/pages/LoginPage";
import ChangePasswordPage from "@/pages/ChangePasswordPage";
import { DashboardPage } from "@/pages/DashboardPage";
import WorkCentersPage from "@/pages/WorkCentersPage";
import MaterialsPage from "@/pages/MaterialsPage";
import OrdersPage from "@/pages/OrdersPage";
import UsersPage from "@/pages/UsersPage";
import AuditLogsPage from "@/pages/AuditLogsPage";
import RoutingsPage from "@/pages/RoutingsPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: "/",
            element: <DashboardPage />,
          },
          {
            path: "/work-centers",
            element: <WorkCentersPage />,
          },
          {
            path: "/materials",
            element: <MaterialsPage />,
          },
          {
            path: "/orders",
            element: <OrdersPage />,
          },
          {
            path: "/users",
            element: <UsersPage />,
          },
          {
            path: "/audit-logs",
            element: <AuditLogsPage />,
          },
          {
            path: "/routings",
            element: <RoutingsPage />,
          },
        ],
      },
      {
        path: "/change-password",
        element: <ChangePasswordPage />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
