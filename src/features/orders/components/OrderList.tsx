import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Plus, Trash2, Edit } from "lucide-react";
import type { Order } from "../types";
import { useOrders, useDeleteOrder } from "../hooks/useOrders";
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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { OrderForm } from "./OrderForm";
import { OrderDetail } from "./OrderDetail";

export const OrderList = () => {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  
  const { data, isLoading } = useOrders({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search,
  });

  const { mutate: deleteOrder } = useDeleteOrder();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "bg-green-100 text-green-800 border-green-200";
      case "IN_PROGRESS": return "bg-blue-100 text-blue-800 border-blue-200";
      case "CANCELLED": return "bg-red-100 text-red-800 border-red-200";
      case "PLANNED": return "bg-amber-100 text-amber-800 border-amber-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "sapOrderNumber",
      header: "SAP Order #",
      cell: ({ row }: { row: any }) => (
        <div className="font-mono font-bold">{row.getValue("sapOrderNumber")}</div>
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
      accessorKey: "targetFGQty",
      header: "Target Qty",
    },
    {
      accessorKey: "netTargetQty",
      header: "Net Qty",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: any }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge className={getStatusColor(status)} variant="outline">
            {status?.replace("_", " ")}
          </Badge>
        );
      },
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }: { row: any }) =>
        new Date(row.getValue("dueDate")).toLocaleDateString(),
    },
    {
      id: "actions",
      cell: ({ row }: { row: any }) => {
        const order = row.original;
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
              <DropdownMenuItem onClick={() => (navigator as any).clipboard.writeText(order.id)}>
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => setSelectedOrderId(order.id)}
              >
                <Edit className="mr-2 h-4 w-4" /> Details
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600 cursor-pointer"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this order?")) {
                    deleteOrder(order.id);
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
          <h2 className="text-2xl font-bold tracking-tight">Production Orders</h2>
          <p className="text-slate-500">Track and schedule manufacturing orders.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create Order
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Production Order</DialogTitle>
            </DialogHeader>
            <OrderForm onSuccess={() => setIsOpen(false)} />
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

      <OrderDetail 
        orderId={selectedOrderId} 
        onClose={() => setSelectedOrderId(null)} 
      />
    </div>
  );
};
