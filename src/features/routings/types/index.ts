import { z } from "zod";

export const PROCESS_TYPES = ["CUTTING", "BENDING", "FORMING", "BRAZING", "PACKING", "OTHER"] as const;

export const routingSchema = z.object({
  materialId: z.string().min(1, "Material is required"),
  stepSequence: z.number().min(1, "Step sequence must be at least 1"),
  processType: z.enum(PROCESS_TYPES),
  cycleTime: z.number().min(0.1, "Cycle time must be at least 0.1 seconds"),
  defaultWorkCenterId: z.string().min(1, "Default work center is required"),
  bomMultiplier: z.number().min(0.1, "BOM multiplier must be at least 0.1"),
  defaultSafetyFactor: z.number().min(0).max(100).optional(),
});

export type Routing = z.infer<typeof routingSchema> & {
  id: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  // Populated fields
  materialId: { _id: string; materialNumber: string; name: string } | string;
  defaultWorkCenterId: { _id: string; workCenterCode: string; name: string } | string;
};

export interface RoutingListResponse {
  data: Routing[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
