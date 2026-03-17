import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Calendar, AlertTriangle, Play, RefreshCw, CheckCircle, Clock, XCircle } from "lucide-react";
import type { ScheduledOperation } from "../types";
import { useAutoSchedule, useReSchedule } from "../hooks/useScheduling";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TimelineTableProps {
  data: ScheduledOperation[];
  isLoading: boolean;
  pageCount: number;
  pagination: { pageIndex: number; pageSize: number };
  onPaginationChange: (pagination: { pageIndex: number; pageSize: number }) => void;
}

export const TimelineTable = ({ data, isLoading, pageCount, pagination, onPaginationChange }: TimelineTableProps) => {
  const [confirmAuto, setConfirmAuto] = useState(false);
  const [confirmRe, setConfirmRe] = useState(false);

  const { mutate: autoSch, isPending: isAutoPending } = useAutoSchedule();
  const { mutate: reSch, isPending: isRePending } = useReSchedule();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING": return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">PENDING</Badge>;
      case "IN_PROGRESS": return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">IN PROGRESS</Badge>;
      case "COMPLETED": return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">COMPLETED</Badge>;
      case "CANCELLED": return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">CANCELLED</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: number) => {
    if (priority === 1) return <Badge variant="destructive">Urgent</Badge>;
    if (priority === 2) return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">High</Badge>;
    return null;
  };

  const columns: ColumnDef<ScheduledOperation>[] = [
    {
      accessorKey: "sapOrderNumber",
      header: "SAP Order #",
      cell: ({ row }) => {
        const order = row.original.orderId;
        const sapNum = typeof order === "object" ? order.sapOrderNumber : row.original.sapOrderNumber;
        return <div className="font-mono font-bold">{sapNum}</div>;
      },
    },
    {
      accessorKey: "workCenterId",
      header: "Work Center",
      cell: ({ row }) => {
        const wc = row.original.workCenterId;
        return typeof wc === "object" ? wc.workCenterCode : wc;
      },
    },
    {
      accessorKey: "processType",
      header: "Process Type",
      cell: ({ row }) => <Badge variant="secondary">{row.getValue("processType")}</Badge>,
    },
    {
      accessorKey: "plannedStartDate",
      header: "Start",
      cell: ({ row }) => new Date(row.getValue("plannedStartDate")).toLocaleDateString(),
    },
    {
      accessorKey: "plannedEndDate",
      header: "End",
      cell: ({ row }) => new Date(row.getValue("plannedEndDate")).toLocaleDateString(),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => getPriorityBadge(row.getValue("priority")),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Production Timeline</h3>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setConfirmAuto(true)}
            disabled={isAutoPending || isRePending}
          >
            {isAutoPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
            Auto Schedule
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setConfirmRe(true)}
            disabled={isAutoPending || isRePending}
          >
            {isRePending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Re-Schedule
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        pageCount={pageCount}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
      />

      {/* Confirm Auto Schedule */}
      <Dialog open={confirmAuto} onOpenChange={setConfirmAuto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Auto-Schedule Production</DialogTitle>
            <DialogDescription>
              This will automatically assign start and end dates for all pending orders based on machine capacity and priority. Existing manual schedules might be affected.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmAuto(false)}>Cancel</Button>
            <Button onClick={() => {
              autoSch({ startDate: new Date().toISOString() });
              setConfirmAuto(false);
            }}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Re-Schedule */}
      <Dialog open={confirmRe} onOpenChange={setConfirmRe}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Re-Schedule Everything</DialogTitle>
            <DialogDescription>
              This will recalculate all planned dates. Use this if there are major shifts in machine availability or production priorities.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmRe(false)}>Cancel</Button>
            <Button onClick={() => {
              reSch();
              setConfirmRe(false);
            }}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Loader2 = ({ className }: { className?: string }) => <RefreshCw className={className} />;
