import axiosInstance from "@/lib/axios";
import type { Order, OrderListResponse } from "../types";

export const getOrders = async (params: any): Promise<OrderListResponse> => {
  const response = await axiosInstance.get("/production-orders", { params });
  return response as unknown as OrderListResponse;
};

export const createOrder = async (data: any): Promise<Order> => {
  const response = await axiosInstance.post("/production-orders", data);
  return response as unknown as Order;
};

export const updateOrder = async (id: string, data: any): Promise<Order> => {
  const response = await axiosInstance.patch(`/production-orders/${id}`, data);
  return response as unknown as Order;
};

export const deleteOrder = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/production-orders/${id}`);
};
