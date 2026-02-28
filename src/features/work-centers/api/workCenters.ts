import axiosInstance from "@/lib/axios";
import type { WorkCenter, WorkCenterListResponse } from "../types";

export const getWorkCenters = async (params: any): Promise<WorkCenterListResponse> => {
  const response = await axiosInstance.get("/work-centers", { params });
  return response as unknown as WorkCenterListResponse;
};

export const createWorkCenter = async (data: any): Promise<WorkCenter> => {
  const response = await axiosInstance.post("/work-centers", data);
  return response as unknown as WorkCenter;
};

export const updateWorkCenter = async (id: string, data: any): Promise<WorkCenter> => {
  const response = await axiosInstance.patch(`/work-centers/${id}`, data);
  return response as unknown as WorkCenter;
};

export const deleteWorkCenter = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/work-centers/${id}`);
};
