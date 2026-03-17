import axiosInstance from "@/lib/axios";
import type { Order, OrderListResponse, PlannedOperation } from "../types";

export const getOrders = async (params: any): Promise<OrderListResponse> => {
  const response = await axiosInstance.get("/orders", { params });
  return response as unknown as OrderListResponse;
};

export const createOrder = async (data: any): Promise<Order> => {
  const response = await axiosInstance.post("/orders", data);
  return response as unknown as Order;
};

export const updateOrder = async (id: string, data: any): Promise<Order> => {
  const response = await axiosInstance.patch(`/orders/${id}`, data);
  return response as unknown as Order;
};

export const deleteOrder = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/orders/${id}`);
};

export const getOrder = async (id: string): Promise<Order & { plannedOperations: PlannedOperation[] }> => {
  const response = await axiosInstance.get(`/orders/${id}`);
  return response as unknown as Order & { plannedOperations: PlannedOperation[] };
};
