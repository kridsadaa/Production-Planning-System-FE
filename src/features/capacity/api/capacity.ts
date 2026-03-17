import axiosInstance from "@/lib/axios";
import type { WorkCenterLoad, DailyCapacity, MrpAlert } from "../types";

// GET /capacity/work-centers?startDate=&endDate=
export const getAllLoads = async (params: { startDate: string; endDate: string }): Promise<WorkCenterLoad[]> => {
  const response = await axiosInstance.get("/capacity/work-centers", { params });
  return response as unknown as WorkCenterLoad[];
};

// GET /capacity/work-centers/:id/daily?startDate=&endDate=
export const getDailyCapacity = async (id: string, params: { startDate: string; endDate: string }): Promise<DailyCapacity[]> => {
  const response = await axiosInstance.get(`/capacity/work-centers/${id}/daily`, { params });
  return response as unknown as DailyCapacity[];
};

// GET /capacity/mrp-alert?startDate=&endDate=
export const getMrpAlert = async (params: { startDate: string; endDate: string }): Promise<MrpAlert[]> => {
  const response = await axiosInstance.get("/capacity/mrp-alert", { params });
  return response as unknown as MrpAlert[];
};
