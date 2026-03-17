import { useQuery } from "@tanstack/react-query";
import { getAllLoads, getMrpAlert } from "../api/capacity";

export const useAllLoads = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ['capacity', 'all-loads', startDate, endDate],
    queryFn: () => getAllLoads({ startDate, endDate }),
  });
};

export const useMrpAlert = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ['capacity', 'mrp-alert', startDate, endDate],
    queryFn: () => getMrpAlert({ startDate, endDate }),
  });
};
