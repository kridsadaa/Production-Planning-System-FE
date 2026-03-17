export interface WorkCenterLoad {
  workCenterId: string;
  workCenterCode: string;
  name: string;
  loadPercent: number;
  scheduledHours: number;
  availableHours: number;
  isOverloaded: boolean;
  status: string;
}

export interface DailyCapacity {
  date: string;
  availableHours: number;
  scheduledHours: number;
  loadPercent: number;
  isOverloaded: boolean;
}

export interface MrpAlert {
  workCenterId: string;
  workCenterCode: string;
  date: string;
  loadPercent: number;
}
