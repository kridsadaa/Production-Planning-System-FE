import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useCapacityWarnings } from "../hooks/useScheduling";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const CapacityWarnings = () => {
  const { data: warnings, isLoading } = useCapacityWarnings();

  if (isLoading) return <div className="animate-pulse h-16 bg-slate-100 rounded-lg" />;

  if (!warnings || warnings.length === 0) {
    return (
      <div className="flex items-center p-4 bg-green-50 text-green-700 rounded-lg border border-green-100">
        <CheckCircle2 className="h-5 w-5 mr-3" />
        <span className="text-sm font-medium">No capacity warnings. Production is within limits.</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center text-amber-600 mb-2">
        <AlertTriangle className="h-5 w-5 mr-2" />
        <span className="text-sm font-bold uppercase tracking-wider">Capacity Alerts ({warnings.length})</span>
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {warnings.map((op) => {
            const sapNum = typeof op.orderId === "object" ? op.orderId.sapOrderNumber : op.sapOrderNumber;
            const wc = typeof op.workCenterId === "object" ? op.workCenterId.workCenterCode : op.workCenterId;
            
            return (
                <Card key={op._id} className="border-amber-200 bg-amber-50/30">
                    <CardContent className="p-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase">Order</p>
                                <p className="text-sm font-mono font-bold">{sapNum}</p>
                            </div>
                            <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">
                                {wc}
                            </Badge>
                        </div>
                        <p className="text-xs mt-2 text-amber-800">
                            Potential delay or overload detected.
                        </p>
                    </CardContent>
                </Card>
            );
        })}
      </div>
    </div>
  );
};
