

export interface AuditLog {
  id: string;
  action: "CREATE" | "UPDATE" | "DELETE";
  entityName: string;
  entityId: string;
  changes: any;
  user: {
    name: string;
    employeeId: string;
  };
  timestamp: string;
}

export interface AuditLogListResponse {
  data: AuditLog[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
