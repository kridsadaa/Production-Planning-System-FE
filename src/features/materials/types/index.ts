import { z } from "zod";

export const materialSchema = z.object({
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  unit: z.string().min(1, "Unit is required"),
  minStockLevel: z.number().min(0, "Min stock level must be positive"),
  currentStockLevel: z.number().min(0, "Current stock level must be positive"),
});

export type Material = z.infer<typeof materialSchema> & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export interface MaterialListResponse {
  data: Material[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
