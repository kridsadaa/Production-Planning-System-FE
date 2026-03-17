export interface ScheduledOperation {
  _id: string;
  orderId: { _id: string; sapOrderNumber: string; dueDate: string } | string;
  workCenterId: { _id: string; workCenterCode: string; name: string } | string;
  materialId: { _id: string; materialNumber: string; name: string } | string;
  sapOrderNumber: string;
  processType: string;
  plannedQty: number;
  plannedStartDate: string;
  plannedEndDate: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority: number;
}

export interface TimelineResponse {
  items: ScheduledOperation[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}
