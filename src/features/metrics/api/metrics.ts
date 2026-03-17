import axiosInstance from "@/lib/axios";
import type { MetricsSummary } from "../types";

export const getMetricsSummary = async (): Promise<MetricsSummary> => {
  const response = await axiosInstance.get("/metrics/summary");
  // axiosInstance already unwraps { statusCode, message, data }
  return response as unknown as MetricsSummary;
};
