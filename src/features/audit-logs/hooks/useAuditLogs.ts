import { useQuery } from "@tanstack/react-query";
import { getAuditLogs } from "../api/auditLogs";

export const useAuditLogs = (params: any) => {
  return useQuery({
    queryKey: ["audit-logs", params],
    queryFn: () => getAuditLogs(params),
  });
};
