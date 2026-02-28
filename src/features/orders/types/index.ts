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
  items: Order[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PlannedOperation {
  sequence: number;
  processType: string;
  workCenterId: string | { _id: string; workCenterCode: string };
  baseQtyRequired: number;
  safetyFactorUsed: number;
  calculatedQty: number;
  plannerOverrideQty?: number;
  finalPlannedQty: number;
  plannedStartDate?: string;
  plannedEndDate?: string;
  completedQty: number;
  executionStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  rawMaterialsConsumed: {
    materialId: string | { _id: string; materialNumber: string };
    materialName: string;
    requiredQty: number;
    availableQty: number;
    isSufficient: boolean;
  }[];
}
