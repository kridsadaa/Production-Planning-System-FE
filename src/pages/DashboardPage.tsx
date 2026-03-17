import { useEffect, useState } from "react";
import { 
  Activity, 
  Package, 
  AlertTriangle,
  Cpu,
  ClipboardList,
  Loader2
} from "lucide-react";
import { socket } from "@/lib/socket";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useMetrics } from "@/features/metrics/hooks/useMetrics";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface SystemEvent {
  id: string;
  type: "machine" | "order" | "schedule" | "alert";
  message: string;
  timestamp: Date;
}

export const DashboardPage = () => {
  const { data: metrics, isLoading } = useMetrics();
  const [events, setEvents] = useState<SystemEvent[]>([]);
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    socket.connect();

    function onConnect() { setIsConnected(true); }
    function onDisconnect() { setIsConnected(false); }
    
    function onMachineUpdate(data: any) {
      addEvent({ type: "machine", message: `Machine ${data.workCenterCode || data.machineId} status updated` });
    }
    
    function onOrderUpdate(data: any) {
      addEvent({ type: "order", message: `Order ${data.sapOrderNumber || data.orderId} status: ${data.status}` });
    }

    function onScheduleReordered() {
      addEvent({ type: "schedule", message: "Production schedule has been reordered" });
    }

    function onMachineOverload(data: any) {
      addEvent({ type: "alert", message: `Overload detected at ${data.workCenterCode}` });
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("machineStatusUpdated", onMachineUpdate);
    socket.on("orderStatusUpdated", onOrderUpdate);
    socket.on("scheduleReordered", onScheduleReordered);
    socket.on("machineOverloadAlert", onMachineOverload);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("machineStatusUpdated", onMachineUpdate);
      socket.off("orderStatusUpdated", onOrderUpdate);
      socket.off("scheduleReordered", onScheduleReordered);
      socket.off("machineOverloadAlert", onMachineOverload);
      socket.disconnect();
    };
  }, []);

  const addEvent = (event: Omit<SystemEvent, "id" | "timestamp">) => {
    const newEvent: SystemEvent = {
        ...event,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date()
    };
    setEvents(prev => [newEvent, ...prev].slice(0, 10));
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  const overloadedCount = metrics?.workCenterLoads.filter(w => w.isOverloaded).length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-slate-500">Real-time overview of your production floor.</p>
        </div>
        <div className="flex items-center space-x-2">
            <span className={cn("h-2 w-2 rounded-full animate-pulse", isConnected ? "bg-green-500" : "bg-red-500")} />
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                {isConnected ? "Live Connection" : "Disconnected"}
            </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders Today</CardTitle>
            <ClipboardList className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.ordersToday || 0}</div>
            <p className="text-xs text-slate-500">Production orders scheduled for today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Cpu className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.ordersByStatus.IN_PROGRESS || 0}</div>
            <p className="text-xs text-slate-500">Currently being processed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planned</CardTitle>
            <Package className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.ordersByStatus.PLANNED || 0}</div>
            <p className="text-xs text-slate-500">Pending start</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overloaded Machines</CardTitle>
            <AlertTriangle className={cn("h-4 w-4", overloadedCount > 0 ? "text-red-500" : "text-slate-500")} />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-2">
              <div className="text-2xl font-bold">{overloadedCount}</div>
              {overloadedCount > 0 && (
                <Badge variant="destructive" className="animate-pulse">Critical</Badge>
              )}
            </div>
            <p className="text-xs text-slate-500">Requires adjustment</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>WorkCenter Loads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {metrics?.workCenterLoads.map((load) => (
                <div key={load.workCenterId} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{load.workCenterCode}</span>
                    <span className={cn(
                      "font-bold",
                      load.isOverloaded ? "text-red-600" : load.loadPercent > 60 ? "text-amber-600" : "text-green-600"
                    )}>
                      {load.loadPercent}%
                    </span>
                  </div>
                  <Progress 
                    value={load.loadPercent} 
                    className="h-2"
                    indicatorClassName={cn(
                      load.isOverloaded ? "bg-red-600" : load.loadPercent > 60 ? "bg-amber-500" : "bg-green-500"
                    )}
                  />
                </div>
              ))}
              {(!metrics?.workCenterLoads || metrics.workCenterLoads.length === 0) && (
                <div className="text-sm text-slate-500 text-center py-4">
                  No work center data available.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Real-time Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.length === 0 ? (
                <div className="text-sm text-slate-500 text-center py-8">
                  Waiting for system events...
                </div>
              ) : (
                events.map((event) => (
                  <div key={event.id} className="flex items-start space-x-3 border-b border-slate-100 pb-3 last:border-0">
                    <div className={cn(
                        "mt-0.5 p-1 rounded",
                        event.type === "machine" && "bg-blue-50 text-blue-600",
                        event.type === "order" && "bg-green-50 text-green-600",
                        event.type === "schedule" && "bg-purple-50 text-purple-600",
                        event.type === "alert" && "bg-red-50 text-red-600",
                    )}>
                        {event.type === "machine" && <Cpu className="h-3 w-3" />}
                        {event.type === "order" && <ClipboardList className="h-3 w-3" />}
                        {event.type === "schedule" && <Activity className="h-3 w-3" />}
                        {event.type === "alert" && <AlertTriangle className="h-3 w-3" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{event.message}</p>
                      <p className="text-xs text-slate-500">{event.timestamp.toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
