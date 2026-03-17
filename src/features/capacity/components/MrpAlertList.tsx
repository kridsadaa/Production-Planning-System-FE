import { AlertCircle } from "lucide-react";
import type { MrpAlert } from "../types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface MrpAlertListProps {
  alerts: MrpAlert[];
  isLoading: boolean;
}

export const MrpAlertList = ({ alerts, isLoading }: MrpAlertListProps) => {
  if (isLoading) return <div className="h-32 bg-slate-50 animate-pulse rounded-lg" />;

  if (alerts.length === 0) {
    return (
      <div className="flex items-center justify-center p-6 bg-green-50 text-green-700 rounded-lg border border-green-100 italic text-sm">
        No overload alerts for this period. All resources within capacity.
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-white overflow-hidden shadow-sm">
      <div className="bg-red-50 px-4 py-2 border-b border-red-100 flex items-center">
          <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
          <span className="text-sm font-bold text-red-800 uppercase tracking-wider">MRP Resource Overload Warnings</span>
      </div>
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow>
            <TableHead className="font-bold">Work Center</TableHead>
            <TableHead className="font-bold">Planned Date</TableHead>
            <TableHead className="text-right font-bold">Planned Load %</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alerts.map((alert, idx) => (
            <TableRow key={idx}>
              <TableCell className="font-mono font-bold">{alert.workCenterCode}</TableCell>
              <TableCell>{new Date(alert.date).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <Badge variant="destructive" className="font-mono">
                  {alert.loadPercent}%
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
