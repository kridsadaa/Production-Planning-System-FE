import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { routingSchema, PROCESS_TYPES } from "../types";
import { useCreateRouting } from "../hooks/useRoutings";
import { useMaterials } from "@/features/materials/hooks/useMaterials";
import { useWorkCenters } from "@/features/work-centers/hooks/useWorkCenters";
import type { Material } from "@/features/materials/types";
import type { WorkCenter } from "@/features/work-centers/types";
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

interface RoutingFormProps {
  onSuccess: () => void;
}

export const RoutingForm = ({ onSuccess }: RoutingFormProps) => {
  const { data: materialsData } = useMaterials({ limit: 100, page: 1 });
  const { data: workCentersData } = useWorkCenters({ limit: 100, page: 1 });
  const { mutate: createRouting, isPending } = useCreateRouting();

  const form = useForm({
    resolver: zodResolver(routingSchema),
    defaultValues: {
      materialId: "",
      stepSequence: 1,
      processType: undefined,
      cycleTime: 1,
      defaultWorkCenterId: "",
      bomMultiplier: 1.0,
      defaultSafetyFactor: 0,
    },
  });

  const onSubmit = (data: any) => {
    createRouting(data, {
      onSuccess: () => {
        form.reset();
        onSuccess();
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Material */}
        <FormField
          control={form.control}
          name="materialId"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Material</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select material" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {materialsData?.data?.map((m: Material) => (
                    <SelectItem key={m._id ?? m.id} value={m._id ?? m.id}>
                      {m.materialNumber} – {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          {/* Step Sequence */}
          <FormField
            control={form.control}
            name="stepSequence"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Step #</FormLabel>
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

          {/* Process Type */}
          <FormField
            control={form.control}
            name="processType"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Process Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select process" />
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
        </div>

        {/* Default Work Center */}
        <FormField
          control={form.control}
          name="defaultWorkCenterId"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Default Work Center</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select work center" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {workCentersData?.data?.map((wc: WorkCenter) => (
                    <SelectItem key={wc._id ?? wc.id} value={wc._id ?? wc.id}>
                      {wc.workCenterCode} – {wc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-4">
          {/* Cycle Time */}
          <FormField
            control={form.control}
            name="cycleTime"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Cycle Time (s)</FormLabel>
                <FormControl>
                  <Input
                    type="number" min={0.1} step={0.1}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* BOM Multiplier */}
          <FormField
            control={form.control}
            name="bomMultiplier"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>BOM Multiplier</FormLabel>
                <FormControl>
                  <Input
                    type="number" min={0.1} step={0.1}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Safety Factor */}
          <FormField
            control={form.control}
            name="defaultSafetyFactor"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Safety Factor (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number" min={0} max={100}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Add Routing Step
        </Button>
      </form>
    </Form>
  );
};
