import { useState } from "react";
import { BarChart2 } from "lucide-react";
import { CapacityOverview } from "../features/capacity/components/CapacityOverview";
import { MrpAlertList } from "../features/capacity/components/MrpAlertList";
import { useAllLoads, useMrpAlert } from "../features/capacity/hooks/useCapacity";
import { Input } from "@/components/ui/input";

export default function CapacityPage() {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

  const { data: loads, isLoading: loadsLoading } = useAllLoads(startDate, endDate);
  const { data: alerts, isLoading: alertsLoading } = useMrpAlert(startDate, endDate);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Capacity Overview</h1>
          <p className="text-slate-500">Resource utilization and capacity planning alerts.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-lg border shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400 uppercase">From</span>
            <Input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
              className="h-8 w-40"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400 uppercase">To</span>
            <Input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)}
              className="h-8 w-40"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <MrpAlertList 
            alerts={alerts || []} 
            isLoading={alertsLoading} 
        />
        
        <div className="pt-4 border-t">
            <div className="flex items-center mb-6">
                <BarChart2 className="h-5 w-5 text-slate-400 mr-2" />
                <h2 className="text-xl font-semibold">Work Center Utilization</h2>
            </div>
            <CapacityOverview 
                loads={loads || []} 
                isLoading={loadsLoading} 
            />
        </div>
      </div>
    </div>
  );
}
