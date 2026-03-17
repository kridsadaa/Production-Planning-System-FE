import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { WorkCenterLoad } from "../types";

interface CapacityOverviewProps {
  loads: WorkCenterLoad[];
  isLoading: boolean;
}

export const CapacityOverview = ({ loads, isLoading }: CapacityOverviewProps) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-20 bg-slate-50" />
            <CardContent className="h-32" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {loads.map((wc) => (
        <Card key={wc.workCenterId} className={cn(
          "transition-all duration-200",
          wc.isOverloaded ? "border-red-200 shadow-red-50" : "hover:border-slate-300"
        )}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg font-bold font-mono">{wc.workCenterCode}</CardTitle>
                <p className="text-sm text-slate-500 truncate max-w-[150px]">{wc.name}</p>
              </div>
              <Badge variant={wc.status === "ACTIVE" ? "outline" : "secondary"} className={cn(
                wc.status === "ACTIVE" ? "bg-green-50 text-green-700 border-green-200" : ""
              )}>
                {wc.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Resource Load</span>
                <span className={cn(
                  "font-bold",
                  wc.isOverloaded ? "text-red-600" : wc.loadPercent > 60 ? "text-amber-600" : "text-green-600"
                )}>
                  {wc.loadPercent}%
                </span>
              </div>
              <Progress 
                value={Math.min(wc.loadPercent, 100)} 
                className="h-2"
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 pt-1">
              <span>Scheduled: <strong>{wc.scheduledHours}h</strong></span>
              <span>Available: <strong>{wc.availableHours}h</strong></span>
            </div>
            {wc.isOverloaded && (
              <div className="mt-2 p-2 bg-red-50 rounded border border-red-100 flex items-center">
                <span className="text-[10px] font-bold text-red-700 uppercase tracking-tighter mr-2">Critical</span>
                <span className="text-[11px] text-red-600">Capacity exceeded by {wc.scheduledHours - wc.availableHours} hours</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      {loads.length === 0 && (
        <div className="col-span-full py-12 text-center border-2 border-dashed rounded-xl text-slate-400">
          No work center load data found for this period.
        </div>
      )}
    </div>
  );
};
