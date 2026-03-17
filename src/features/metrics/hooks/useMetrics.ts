import { useQuery } from "@tanstack/react-query";
import { getMetricsSummary } from "../api/metrics";

export const useMetrics = () => {
  return useQuery({
    queryKey: ["metrics", "summary"],
    queryFn: getMetricsSummary,
    refetchInterval: 30000,
  });
};
