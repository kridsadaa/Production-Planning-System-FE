import { z } from "zod";

export const orderSchema = z.object({
  sapOrderNumber: z.string().min(1, "SAP Order number is required"),
  materialId: z.string().min(1, "Material is required"),
  targetFGQty: z.number().min(1, "Target quantity must be at least 1"),
  dueDate: z.string().min(1, "Due date is required"),
  existingStockQty: z.number().min(0).optional(),
  status: z.enum(["PLANNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
});

export type Order = z.infer<typeof orderSchema> & {
  id: string;
  netTargetQty: number;
  createdAt: string;
  updatedAt: string;
  // Populated field from backend
  materialId: {
    _id: string;
    materialNumber: string;
    name: string;
  } | string;
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
