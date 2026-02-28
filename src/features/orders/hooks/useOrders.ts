import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  getOrders, 
  createOrder, 
  updateOrder, 
  deleteOrder 
} from "../api/orders";

export const useOrders = (params: any) => {
  return useQuery({
    queryKey: ["production-orders", params],
    queryFn: () => getOrders(params),
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["production-orders"] });
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateOrder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["production-orders"] });
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["production-orders"] });
    },
  });
};
