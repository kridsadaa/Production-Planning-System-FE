import { z } from "zod";

export const orderSchema = z.object({
  orderNumber: z.string().min(1, "Order number is required"),
  partId: z.string().min(1, "Part is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  dueDate: z.string().min(1, "Due date is required"),
  status: z.enum(["pending", "in_progress", "completed", "cancelled"]),
});

export type Order = z.infer<typeof orderSchema> & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export interface OrderListResponse {
  data: Order[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
