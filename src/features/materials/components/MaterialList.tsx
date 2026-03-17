import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Plus, Trash2, Edit, AlertCircle } from "lucide-react";
import type { Material } from "../types";
import { useMaterials, useDeleteMaterial } from "../hooks/useMaterials";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const MaterialList = () => {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [search, setSearch] = useState("");
  
  const { data, isLoading } = useMaterials({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search,
  });

  const { mutate: deleteMaterial } = useDeleteMaterial();

  const columns: ColumnDef<Material>[] = [
    {
      accessorKey: "sku",
      header: "SKU",
      cell: ({ row }: { row: any }) => <div className="font-mono font-medium">{row.getValue("sku")}</div>,
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "currentStockLevel",
      header: "Stock Level",
      cell: ({ row }: { row: any }) => {
        const material = row.original;
        const isLow = material.currentStockLevel <= material.minStockLevel;
        return (
          <div className="flex items-center space-x-2">
            <span className={isLow ? "text-red-600 font-bold" : ""}>
                {material.currentStockLevel} {material.unit}
            </span>
            {isLow && (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <AlertCircle className="h-4 w-4 text-red-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                            Low stock alert: Below {material.minStockLevel} {material.unit}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Last Updated",
      cell: ({ row }: { row: any }) => new Date(row.getValue("updatedAt")).toLocaleDateString(),
    },
    {
      id: "actions",
      cell: ({ row }: { row: any }) => {
        const material = row.original;
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
              <DropdownMenuItem onClick={() => (navigator as any).clipboard.writeText(material.id)}>
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600 cursor-pointer"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this material?")) {
                    deleteMaterial(material.id);
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
          <h2 className="text-2xl font-bold tracking-tight">Materials Inventory</h2>
          <p className="text-slate-500">Track and manage raw materials and parts inventory.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Material
        </Button>
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
