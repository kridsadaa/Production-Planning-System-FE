import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getRoutings,
  createRouting,
  updateRouting,
  deleteRouting,
} from "../api/routings";

export const useRoutings = (params: any) => {
  return useQuery({
    queryKey: ["routings", params],
    queryFn: () => getRoutings(params),
  });
};

export const useCreateRouting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRouting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routings"] });
    },
  });
};

export const useUpdateRouting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateRouting(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routings"] });
    },
  });
};

export const useDeleteRouting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRouting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routings"] });
    },
  });
};
