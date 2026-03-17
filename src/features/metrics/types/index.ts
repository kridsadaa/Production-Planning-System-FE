export interface WorkCenterLoad {
  workCenterId: string;
  workCenterCode: string;
  loadPercent: number;
  isOverloaded: boolean;
}

export interface MetricsSummary {
  ordersToday: number;
  ordersByStatus: {
    PLANNED: number;
    IN_PROGRESS: number;
    COMPLETED: number;
    CANCELLED: number;
  };
  workCenterLoads: WorkCenterLoad[];
  generatedAt: string;
}
