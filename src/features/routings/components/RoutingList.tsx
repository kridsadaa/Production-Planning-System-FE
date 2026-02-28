import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Plus, Trash2, Box } from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
        <div className="font-mono font-bold text-slate-500">#{row.getValue("stepSequence")}</div>
      ),
    },
    {
      accessorKey: "materialId",
      header: "Finished Good",
      cell: ({ row }: { row: any }) => {
        const mat = row.getValue("materialId");
        if (mat && typeof mat === "object") {
          return (
            <div className="flex flex-col">
              <span className="font-medium">{mat.materialNumber}</span>
              <span className="text-xs text-slate-400 truncate max-w-[150px]">{mat.name}</span>
            </div>
          );
        }
        return <span className="text-slate-400">—</span>;
      },
    },
    {
      accessorKey: "processType",
      header: "Process",
      cell: ({ row }: { row: any }) => (
        <Badge variant="outline" className="bg-slate-50">{row.getValue("processType")}</Badge>
      ),
    },
    {
      accessorKey: "defaultWorkCenterId",
      header: "Work Center",
      cell: ({ row }: { row: any }) => {
        const wc = row.getValue("defaultWorkCenterId");
        if (wc && typeof wc === "object") {
          return (
            <div className="flex flex-col">
              <span className="text-sm">{wc.workCenterCode}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-tight">{wc.name}</span>
            </div>
          );
        }
        return <span className="text-slate-400">—</span>;
      },
    },
    {
      id: "bom",
      header: "BOM (Input)",
      cell: ({ row }: { row: any }) => {
        const routing = row.original as Routing;
        const inputMat = routing.inputMaterialId;
        const qty = routing.inputQtyPerOutputUnit;

        if (!inputMat || typeof inputMat !== "object") {
          return <span className="text-slate-300 text-xs">—</span>;
        }

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-2 text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100 w-fit cursor-help">
                  <Box className="h-3 w-3" />
                  <span className="text-xs font-bold">{qty || "???"} / unit</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-bold">{inputMat.materialNumber}</p>
                <p className="text-xs">{inputMat.name}</p>
                <p className="text-[10px] mt-1 text-slate-400">Consumed per 1 output unit</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      accessorKey: "cycleTime",
      header: "Cycle (s)",
      cell: ({ row }: { row: any }) => <span className="font-mono">{row.getValue("cycleTime")}s</span>,
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
            Define production routing steps and raw material consumption.
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Routing Step
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
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
