import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
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
  FormDescription,
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
import { Separator } from "@/components/ui/separator";

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
      bom: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "bom",
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[80vh] overflow-y-auto px-1">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Basic Info</h3>
          {/* Material */}
          <FormField
            control={form.control}
            name="materialId"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Finished Good (Output)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select material" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {materialsData?.items?.map((m: Material) => (
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
                  <FormLabel>Step Sequence #</FormLabel>
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
                <FormLabel>Primary Work Center</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select work center" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {workCentersData?.items?.map((wc: WorkCenter) => (
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
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Timing & Efficiency</h3>
          <div className="grid grid-cols-3 gap-4">
            {/* Cycle Time */}
            <FormField
              control={form.control}
              name="cycleTime"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Cycle (s)</FormLabel>
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
                  <FormLabel>Multiplier</FormLabel>
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
                  <FormLabel>Safety %</FormLabel>
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
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">BOM (Raw Materials)</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ materialId: "", qtyPerUnit: 0.0001 })}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Material
            </Button>
          </div>
          
          {fields.length === 0 && (
            <p className="text-xs text-slate-400 italic text-center py-4 bg-slate-50 rounded-md border-dashed border-2">
              No materials defined for this step.
            </p>
          )}

          {fields.map((field, index) => (
            <div key={field.id} className="space-y-4 p-4 border rounded-md relative group">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 text-slate-400 hover:text-red-600 transition-colors"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>

              <FormField
                control={form.control}
                name={`bom.${index}.materialId`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Input Material</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select raw material" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {materialsData?.items?.map((m: Material) => (
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

              <FormField
                control={form.control}
                name={`bom.${index}.qtyPerUnit`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qty per Unit</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0.0001}
                        step={0.0001}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>Consumption for 1 output piece.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? "Adding..." : "Add Routing Step"}
        </Button>
      </form>
    </Form>
  );
};
