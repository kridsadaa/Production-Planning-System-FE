import { z } from "zod";

export const PROCESS_TYPES = ["CUTTING", "BENDING", "FORMING", "BRAZING", "PACKING", "OTHER"] as const;
export const MACHINE_STATUSES = ["RUNNING", "IDLE", "STANDBY", "OVERLOAD", "MAINTENANCE", "PARTIAL_DOWN"] as const;

export const workCenterSchema = z.object({
  workCenterCode: z.string().min(1, "Work center code is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  processType: z.enum(PROCESS_TYPES),
  status: z.enum(MACHINE_STATUSES).optional(),
  totalHeads: z.number().min(1, "Total heads must be at least 1"),
  activeHeads: z.number().min(0, "Active heads must be at least 0"),
  allowConcurrentJobs: z.boolean().default(false),
  efficiencyFactor: z.number().min(1).max(100),
});

export type WorkCenter = z.infer<typeof workCenterSchema> & {
  id: string;
  _id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export interface WorkCenterListResponse {
  items: WorkCenter[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
