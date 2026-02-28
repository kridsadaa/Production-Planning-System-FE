import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  getWorkCenters, 
  createWorkCenter, 
  updateWorkCenter, 
  deleteWorkCenter 
} from "../api/workCenters";

export const useWorkCenters = (params: any) => {
  return useQuery({
    queryKey: ["work-centers", params],
    queryFn: () => getWorkCenters(params),
  });
};

export const useCreateWorkCenter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createWorkCenter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work-centers"] });
    },
  });
};

export const useUpdateWorkCenter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateWorkCenter(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work-centers"] });
    },
  });
};

export const useDeleteWorkCenter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteWorkCenter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work-centers"] });
    },
  });
};
