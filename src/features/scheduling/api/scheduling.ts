import axiosInstance from "@/lib/axios";
import type { TimelineResponse, ScheduledOperation } from "../types";

// GET /scheduling/timeline?startDate=&endDate=
export const getTimeline = async (params: { startDate: string; endDate: string; page?: number; limit?: number }): Promise<TimelineResponse> => {
  const response = await axiosInstance.get("/scheduling/timeline", { params });
  return response as unknown as TimelineResponse;
};

// POST /scheduling/auto-schedule
export const autoSchedule = async (data: { startDate: string; orderIds?: string[] }): Promise<{ reordered: number }> => {
  const response = await axiosInstance.post("/scheduling/auto-schedule", data);
  return response as unknown as { reordered: number };
};

// POST /scheduling/re-schedule
export const reSchedule = async (): Promise<{ reordered: number; workCenters: number }> => {
  const response = await axiosInstance.post("/scheduling/re-schedule");
  return response as unknown as { reordered: number; workCenters: number };
};

// GET /scheduling/capacity-warnings
export const getCapacityWarnings = async (): Promise<ScheduledOperation[]> => {
  const response = await axiosInstance.get("/scheduling/capacity-warnings");
  return response as unknown as ScheduledOperation[];
};
