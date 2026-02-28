import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { History, User as UserIcon, Activity } from "lucide-react";
import type { AuditLog } from "../types";
import { useAuditLogs } from "../hooks/useAuditLogs";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";

export const AuditLogList = () => {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });
  const [search, setSearch] = useState("");
  
  const { data, isLoading } = useAuditLogs({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search,
  });

  const getActionColor = (action: string) => {
    switch (action) {
      case "CREATE": return "bg-green-100 text-green-800 border-green-200";
      case "UPDATE": return "bg-blue-100 text-blue-800 border-blue-200";
      case "DELETE": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const columns: ColumnDef<AuditLog>[] = [
    {
      accessorKey: "timestamp",
      header: "Timestamp",
      cell: ({ row }: { row: any }) => {
        const date = new Date(row.getValue("timestamp"));
        return (
          <div className="flex flex-col">
            <span className="text-sm font-medium">{date.toLocaleDateString()}</span>
            <span className="text-xs text-slate-500">{date.toLocaleTimeString()}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }: { row: any }) => (
        <Badge className={getActionColor(row.getValue("action"))} variant="outline">
          {row.getValue("action")}
        </Badge>
      ),
    },
    {
      accessorKey: "entityName",
      header: "Resource",
      cell: ({ row }: { row: any }) => (
        <div className="flex items-center">
          <Activity className="h-3.5 w-3.5 mr-2 text-slate-400" />
          <span className="font-medium">{row.getValue("entityName")}</span>
        </div>
      ),
    },
    {
        id: "triggeredBy",
        header: "User",
        cell: ({ row }: { row: any }) => {
          const user = row.original.user;
          return (
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center border">
                <UserIcon className="h-3 w-3 text-slate-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium">{user.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">{user.employeeId}</span>
              </div>
            </div>
          );
        },
    },
    {
      accessorKey: "changes",
      header: "Changes",
      cell: ({ row }: { row: any }) => (
        <div className="max-w-[200px] truncate text-xs text-slate-500 font-mono">
          {JSON.stringify(row.getValue("changes"))}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 border-b pb-4 mb-4">
        <History className="h-6 w-6 text-slate-400" />
        <div>
          <h2 className="text-2xl font-bold tracking-tight">System Audit Logs</h2>
          <p className="text-slate-500 text-sm">Review historical actions and data mutations within the MES.</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        pageCount={data?.meta?.totalPages || 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        onSearchChange={setSearch}
        isLoading={isLoading}
      />
    </div>
  );
};
