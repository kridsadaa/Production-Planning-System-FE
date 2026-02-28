import axiosInstance from "@/lib/axios";
import type { AuditLogListResponse } from "../types";

export const getAuditLogs = async (params: any): Promise<AuditLogListResponse> => {
  const response = await axiosInstance.get("/audit-logs", { params });
  return response as unknown as AuditLogListResponse;
};
