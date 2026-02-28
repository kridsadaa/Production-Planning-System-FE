import axiosInstance from "@/lib/axios";
import type { Routing, RoutingListResponse } from "../types";

export const getRoutings = async (params: any): Promise<RoutingListResponse> => {
  const response = await axiosInstance.get("/routings", { params });
  return response as unknown as RoutingListResponse;
};

export const getRoutingsByMaterial = async (materialId: string): Promise<Routing[]> => {
  const response = await axiosInstance.get(`/routings/material/${materialId}`);
  return response as unknown as Routing[];
};

export const createRouting = async (data: any): Promise<Routing> => {
  const response = await axiosInstance.post("/routings", data);
  return response as unknown as Routing;
};

export const updateRouting = async (id: string, data: any): Promise<Routing> => {
  const response = await axiosInstance.patch(`/routings/${id}`, data);
  return response as unknown as Routing;
};

export const deleteRouting = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/routings/${id}`);
};
