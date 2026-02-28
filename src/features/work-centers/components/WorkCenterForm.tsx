import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { workCenterSchema, PROCESS_TYPES, MACHINE_STATUSES } from "../types";
import { useCreateWorkCenter } from "../hooks/useWorkCenters";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WorkCenterFormProps {
  onSuccess: () => void;
}

export const WorkCenterForm = ({ onSuccess }: WorkCenterFormProps) => {
  const { mutate: createWorkCenter, isPending } = useCreateWorkCenter();

  const form = useForm({
    resolver: zodResolver(workCenterSchema),
    defaultValues: {
      workCenterCode: "",
      name: "",
      processType: undefined,
      status: undefined,
      totalHeads: 1,
      activeHeads: 1,
      allowConcurrentJobs: false,
      efficiencyFactor: 100,
    },
  });

  const onSubmit = (data: any) => {
    createWorkCenter(data, {
      onSuccess: () => {
        form.reset();
        onSuccess();
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="workCenterCode"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Work Center Code</FormLabel>
                <FormControl>
                  <Input placeholder="WC-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Cutting Line A" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="processType"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Process Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select process type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PROCESS_TYPES.map((pt) => (
                    <SelectItem key={pt} value={pt}>{pt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="totalHeads"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Total Heads</FormLabel>
                <FormControl>
                  <Input
                    type="number" min={1}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="activeHeads"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Active Heads</FormLabel>
                <FormControl>
                  <Input
                    type="number" min={0}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="efficiencyFactor"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Efficiency (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number" min={1} max={100}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Status (optional)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="IDLE (default)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {MACHINE_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Add Work Center
        </Button>
      </form>
    </Form>
  );
};
