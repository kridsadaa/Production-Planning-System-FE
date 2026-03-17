import { useOrder, useUpdateOrder } from "../hooks/useOrders";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, Target, Hash, AlertTriangle } from "lucide-react";
import type { PlannedOperation } from "../types";

interface OrderDetailProps {
  orderId: string | null;
  onClose: () => void;
}

export const OrderDetail = ({ orderId, onClose }: OrderDetailProps) => {
  const { data: order, isLoading } = useOrder(orderId);
  const { mutate: updateOrder } = useUpdateOrder();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "bg-green-100 text-green-800 border-green-200";
      case "IN_PROGRESS": return "bg-blue-100 text-blue-800 border-blue-200";
      case "CANCELLED": return "bg-red-100 text-red-800 border-red-200";
      case "PLANNED": return "bg-amber-100 text-amber-800 border-amber-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const handleStatusChange = (status: string) => {
    if (orderId) {
      updateOrder({ id: orderId, data: { status } });
    }
  };

  const handlePriorityChange = (priority: string) => {
    if (orderId) {
      updateOrder({ id: orderId, data: { priority: parseInt(priority) } });
    }
  };

  return (
    <Dialog open={!!orderId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between pr-8">
            <DialogTitle className="text-2xl font-bold font-mono">
              {isLoading ? "Loading Order..." : `Order: ${order?.sapOrderNumber}`}
            </DialogTitle>
            {!isLoading && order && (
              <Badge className={getStatusColor(order.status || "")}>
                {order.status}
              </Badge>
            )}
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        ) : order ? (
          <div className="space-y-8 py-4">
            {/* Order Header Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-500 uppercase flex items-center">
                    <Target className="h-3 w-3 mr-1" /> Material
                </p>
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold truncate">
                      {(order.materialId as any)?.materialNumber || order.materialId}
                  </p>
                  <p className="text-xs text-slate-400">
                      {(order.materialId as any)?.name || ""}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-500 uppercase flex items-center">
                    <Hash className="h-3 w-3 mr-1" /> Quantity (FG / Net)
                </p>
                <p className="text-sm font-semibold">{order.targetFGQty} / {order.netTargetQty}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-500 uppercase flex items-center">
                    <Calendar className="h-3 w-3 mr-1" /> Due Date
                </p>
                <p className="text-sm font-semibold">{new Date(order.dueDate).toLocaleDateString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-500 uppercase flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" /> Priority
                </p>
                <Select 
                    defaultValue={String((order as any).priority || 3)} 
                    onValueChange={handlePriorityChange}
                >
                    <SelectTrigger className="h-8 w-24">
                        <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                        {[1, 2, 3, 4, 5].map(p => (
                            <SelectItem key={p} value={String(p)}>
                                {p === 1 ? "1 (Max)" : p}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border">
                <span className="text-sm font-medium text-slate-600">Quick Status Update:</span>
                <div className="flex gap-2">
                    {["PLANNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map(s => (
                        <Button 
                            key={s}
                            variant={order.status === s ? "default" : "outline"}
                            size="sm"
                            className="h-8 text-[10px] font-bold"
                            onClick={() => handleStatusChange(s)}
                        >
                            {s}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Planned Operations Table */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center">
                    Planned Operations
                </h3>
                <div className="rounded-md border bg-white overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="w-12 text-center">Seq</TableHead>
                                <TableHead>Process Type</TableHead>
                                <TableHead>Work Center</TableHead>
                                <TableHead className="text-right">Qty</TableHead>
                                <TableHead>Start</TableHead>
                                <TableHead>End</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.plannedOperations?.map((op: PlannedOperation, idx: number) => (
                                <TableRow key={idx}>
                                    <TableCell className="text-center font-mono">{op.sequence}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{op.processType}</Badge>
                                    </TableCell>
                                    <TableCell className="font-mono">
                                        {typeof op.workCenterId === "object" ? op.workCenterId.workCenterCode : op.workCenterId}
                                    </TableCell>
                                    <TableCell className="text-right">{op.finalPlannedQty}</TableCell>
                                    <TableCell className="text-xs">
                                        {op.plannedStartDate ? new Date(op.plannedStartDate).toLocaleDateString() : "—"}
                                    </TableCell>
                                    <TableCell className="text-xs">
                                        {op.plannedEndDate ? new Date(op.plannedEndDate).toLocaleDateString() : "—"}
                                    </TableCell>
                                    <TableCell>
                                        <Badge 
                                            variant="outline" 
                                            className={cn(
                                                "text-[10px]",
                                                op.executionStatus === "COMPLETED" ? "bg-green-50 text-green-700 border-green-200" :
                                                op.executionStatus === "IN_PROGRESS" ? "bg-blue-50 text-blue-700 border-blue-200" :
                                                "bg-slate-50 text-slate-600 border-slate-200"
                                            )}
                                        >
                                            {op.executionStatus}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {(!order.plannedOperations || order.plannedOperations.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center text-slate-400 italic">
                                        No planned operations found for this order.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500">Order not found.</div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const cn = (...inputs: any[]) => inputs.filter(Boolean).join(" ");
