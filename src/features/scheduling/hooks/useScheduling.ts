import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  getTimeline, 
  autoSchedule, 
  reSchedule, 
  getCapacityWarnings 
} from "../api/scheduling";

export const useTimeline = (startDate: string, endDate: string, page?: number, limit?: number) => {
  return useQuery({
    queryKey: ['scheduling', 'timeline', startDate, endDate, page, limit],
    queryFn: () => getTimeline({ startDate, endDate, page, limit }),
  });
};

export const useAutoSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: autoSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduling', 'timeline'] });
    },
  });
};

export const useReSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduling', 'timeline'] });
    },
  });
};

export const useCapacityWarnings = () => {
  return useQuery({
    queryKey: ['scheduling', 'capacity-warnings'],
    queryFn: getCapacityWarnings,
  });
};
