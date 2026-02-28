import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Plus, Trash2, Edit } from "lucide-react";
import type { WorkCenter } from "../types";
import { useWorkCenters, useDeleteWorkCenter } from "../hooks/useWorkCenters";
import { WorkCenterForm } from "./WorkCenterForm";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const STATUS_COLORS: Record<string, string> = {
  RUNNING: "bg-green-100 text-green-800",
  IDLE: "bg-slate-100 text-slate-800",
  STANDBY: "bg-blue-100 text-blue-800",
  OVERLOAD: "bg-red-100 text-red-800",
  MAINTENANCE: "bg-amber-100 text-amber-800",
  PARTIAL_DOWN: "bg-orange-100 text-orange-800",
};

export const WorkCenterList = () => {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading } = useWorkCenters({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search,
  });

  const { mutate: deleteWC } = useDeleteWorkCenter();

  const columns: ColumnDef<WorkCenter>[] = [
    {
      accessorKey: "workCenterCode",
      header: "Code",
      cell: ({ row }: { row: any }) => (
        <div className="font-mono font-bold">{row.getValue("workCenterCode")}</div>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }: { row: any }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "processType",
      header: "Process",
      cell: ({ row }: { row: any }) => (
        <Badge variant="outline">{row.getValue("processType")}</Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: any }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge className={STATUS_COLORS[status] ?? "bg-slate-100 text-slate-800"} variant="outline">
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "totalHeads",
      header: "Heads",
      cell: ({ row }: { row: any }) => {
        const wc = row.original as WorkCenter;
        return <span>{wc.activeHeads} / {wc.totalHeads}</span>;
      },
    },
    {
      accessorKey: "efficiencyFactor",
      header: "Efficiency",
      cell: ({ row }: { row: any }) => `${row.getValue("efficiencyFactor")}%`,
    },
    {
      id: "actions",
      cell: ({ row }: { row: any }) => {
        const wc = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => (navigator as any).clipboard.writeText(wc._id ?? wc.id)}>
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 cursor-pointer"
                onClick={() => {
                  if (confirm(`Delete work center "${wc.name}"?`)) {
                    deleteWC(wc._id ?? wc.id);
                  }
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Work Centers</h2>
          <p className="text-slate-500">Manage manufacturing work centers and production lines.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Work Center
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Work Center</DialogTitle>
            </DialogHeader>
            <WorkCenterForm onSuccess={() => setIsOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        columns={columns}
        data={data?.items || []}
        pageCount={data?.meta?.totalPages || 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        onSearchChange={setSearch}
        isLoading={isLoading}
      />
    </div>
  );
};
