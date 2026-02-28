import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Plus, Trash2, Box, Info } from "lucide-react";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
              <span className="font-medium text-sm">{mat.materialNumber}</span>
              <span className="text-[10px] text-slate-400 truncate max-w-[150px]">{mat.name}</span>
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
        <Badge variant="outline" className="bg-slate-50 text-[10px]">{row.getValue("processType")}</Badge>
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
              <span className="text-xs font-medium">{wc.workCenterCode}</span>
              <span className="text-[9px] text-slate-400 uppercase tracking-tight">{wc.name}</span>
            </div>
          );
        }
        return <span className="text-slate-400">—</span>;
      },
    },
    {
      id: "bom",
      header: "BOM (Materials)",
      cell: ({ row }: { row: any }) => {
        const routing = row.original as Routing;
        const bom = routing.bom || [];

        if (bom.length === 0) {
          return <span className="text-slate-300 text-[10px] italic">No materials</span>;
        }

        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 px-2 text-[10px] gap-1 border-blue-100 bg-blue-50/50 text-blue-600 hover:bg-blue-100/50">
                <Box className="h-3 w-3" />
                {bom.length} Material{bom.length > 1 ? 's' : ''}
                <Info className="h-3 w-3 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3 shadow-xl border-slate-200">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <Box className="h-3 w-3" /> Bill of Materials
                </h4>
                <div className="space-y-2">
                  {bom.map((item, idx) => {
                    const mat = item.materialId;
                    const isObject = mat && typeof mat === "object";
                    return (
                      <div key={idx} className="flex flex-col p-2 bg-slate-50 rounded border border-slate-100">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[11px] font-bold text-slate-700">
                            {isObject ? (mat as any).materialNumber : "Unknown"}
                          </span>
                          <span className="text-[10px] font-mono bg-white px-1 border rounded text-blue-600">
                            {item.qtyPerUnit} / unit
                          </span>
                        </div>
                        {isObject && (
                          <span className="text-[9px] text-slate-400 truncate">{(mat as any).name}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        );
      },
    },
    {
      accessorKey: "cycleTime",
      header: "Cycle",
      cell: ({ row }: { row: any }) => <span className="font-mono text-xs">{row.getValue("cycleTime")}s</span>,
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
            Define production routing steps and bill of materials (BOM).
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
