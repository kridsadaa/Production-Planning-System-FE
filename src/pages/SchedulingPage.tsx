import { useState } from "react";
import { TimelineTable } from "../features/scheduling/components/TimelineTable";
import { CapacityWarnings } from "../features/scheduling/components/CapacityWarnings";
import { useTimeline } from "../features/scheduling/hooks/useScheduling";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function SchedulingPage() {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const { data, isLoading } = useTimeline(
    startDate, 
    endDate, 
    pagination.pageIndex + 1, 
    pagination.pageSize
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scheduling</h1>
          <p className="text-slate-500">Manage production timeline and resource allocation.</p>
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

      <CapacityWarnings />

      <Card>
        <CardContent className="p-6">
          <TimelineTable 
            data={data?.items || []}
            isLoading={isLoading}
            pageCount={data?.meta?.totalPages || 0}
            pagination={pagination}
            onPaginationChange={setPagination}
          />
        </CardContent>
      </Card>
    </div>
  );
}
