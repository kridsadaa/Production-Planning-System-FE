import { z } from "zod";

export const materialSchema = z.object({
  materialNumber: z.string().min(1, "Material number is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
});

export type Material = z.infer<typeof materialSchema> & {
  id: string;
  _id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export interface MaterialListResponse {
  items: Material[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
