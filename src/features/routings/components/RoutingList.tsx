import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Plus, Trash2 } from "lucide-react";
import type { Routing } from "../types";
import { useRoutings, useDeleteRouting } from "../hooks/useRoutings";
import { RoutingForm } from "./RoutingForm";
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

export const RoutingList = () => {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading } = useRoutings({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search,
  });

  const { mutate: deleteRouting } = useDeleteRouting();

  const columns: ColumnDef<Routing>[] = [
    {
      accessorKey: "stepSequence",
      header: "Step #",
      cell: ({ row }: { row: any }) => (
        <div className="font-mono font-bold">#{row.getValue("stepSequence")}</div>
      ),
    },
    {
      accessorKey: "materialId",
      header: "Material",
      cell: ({ row }: { row: any }) => {
        const mat = row.getValue("materialId");
        if (mat && typeof mat === "object") {
          return <span>{mat.materialNumber} – {mat.name}</span>;
        }
        return <span className="text-slate-400">—</span>;
      },
    },
    {
      accessorKey: "processType",
      header: "Process",
      cell: ({ row }: { row: any }) => (
        <Badge variant="outline">{row.getValue("processType")}</Badge>
      ),
    },
    {
      accessorKey: "defaultWorkCenterId",
      header: "Work Center",
      cell: ({ row }: { row: any }) => {
        const wc = row.getValue("defaultWorkCenterId");
        if (wc && typeof wc === "object") {
          return <span>{wc.workCenterCode} – {wc.name}</span>;
        }
        return <span className="text-slate-400">—</span>;
      },
    },
    {
      accessorKey: "cycleTime",
      header: "Cycle (s)",
    },
    {
      accessorKey: "bomMultiplier",
      header: "BOM x",
    },
    {
      accessorKey: "defaultSafetyFactor",
      header: "Safety %",
    },
    {
      id: "actions",
      cell: ({ row }: { row: any }) => {
        const routing = row.original;
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
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 cursor-pointer"
                onClick={() => {
                  if (confirm("Delete this routing step?")) {
                    deleteRouting(routing._id ?? routing.id);
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
          <h2 className="text-2xl font-bold tracking-tight">Routings</h2>
          <p className="text-slate-500">
            Define production routing steps, cycle times, and work center assignments.
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Routing Step
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Routing Step</DialogTitle>
            </DialogHeader>
            <RoutingForm onSuccess={() => setIsOpen(false)} />
          </DialogContent>
        </Dialog>
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
