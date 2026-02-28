import { useEffect, useState } from "react";
import { 
  Activity, 
  Package, 
  AlertTriangle,
  Cpu,
  ClipboardList
} from "lucide-react";
import { socket } from "@/lib/socket";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SystemEvent {
  id: string;
  type: "machine" | "order" | "inventory";
  message: string;
  timestamp: Date;
}

export const DashboardPage = () => {
  const [events, setEvents] = useState<SystemEvent[]>([]);
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    socket.connect();

    function onConnect() { setIsConnected(true); }
    function onDisconnect() { setIsConnected(false); }
    
    function onMachineUpdate(data: any) {
      addEvent({ type: "machine", message: `Machine ${data.machineId} status changed to ${data.status}` });
    }
    
    function onOrderUpdate(data: any) {
      addEvent({ type: "order", message: `Order ${data.orderId} updated: ${data.status}` });
    }

    function onInventoryUpdate(data: any) {
      addEvent({ type: "inventory", message: `Material ${data.materialId} stock level: ${data.level}` });
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("machine-status-update", onMachineUpdate);
    socket.on("order-update", onOrderUpdate);
    socket.on("inventory-update", onInventoryUpdate);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("machine-status-update", onMachineUpdate);
      socket.off("order-update", onOrderUpdate);
      socket.off("inventory-update", onInventoryUpdate);
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
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ClipboardList className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-slate-500">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Machines</CardTitle>
            <Cpu className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14 / 16</div>
            <p className="text-xs text-slate-500">2 in maintenance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-slate-500">Needs immediate attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Production Rate</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-slate-500">+2.1% from target</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 h-[400px] flex items-center justify-center text-slate-400 border-dashed border-2">
            Production Statistics Chart (Placeholder)
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
                        event.type === "inventory" && "bg-amber-50 text-amber-600",
                    )}>
                        {event.type === "machine" && <Cpu className="h-3 w-3" />}
                        {event.type === "order" && <ClipboardList className="h-3 w-3" />}
                        {event.type === "inventory" && <Package className="h-3 w-3" />}
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
