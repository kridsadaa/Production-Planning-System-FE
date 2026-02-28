import { z } from "zod";

export const workCenterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"]),
});

export type WorkCenter = z.infer<typeof workCenterSchema> & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export interface WorkCenterListResponse {
  data: WorkCenter[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
