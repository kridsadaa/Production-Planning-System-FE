import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertCircle } from "lucide-react";
import { orderSchema } from "../types";
import { useCreateOrder } from "../hooks/useOrders";
import { useMaterials } from "@/features/materials/hooks/useMaterials";
import type { Material } from "@/features/materials/types";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
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

interface OrderFormProps {
  onSuccess: () => void;
}

export const OrderForm = ({ onSuccess }: OrderFormProps) => {
  const { data: materialsData, isLoading: isLoadingMaterials } = useMaterials({
    limit: 100,
    page: 1,
  });

  const { mutate: createOrder, isPending, error } = useCreateOrder();

  const form = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      sapOrderNumber: `SAP-${Math.floor(Math.random() * 100000)}`,
      materialId: "",
      targetFGQty: 1,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      existingStockQty: 0,
    },
  });

  const onSubmit = (data: any) => {
    createOrder(data, {
      onSuccess: () => {
        form.reset();
        onSuccess();
      },
    });
  };

  // Extract error message from axios error
  const errorMessage = (() => {
    if (!error) return null;
    const axiosError = error as any;
    return (
      axiosError?.response?.data?.message ||
      axiosError?.message ||
      "An error occurred. Please try again."
    );
  })();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* API Error Display */}
        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* SAP Order Number */}
        <FormField
          control={form.control}
          name="sapOrderNumber"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>SAP Order Number</FormLabel>
              <FormControl>
                <Input placeholder="SAP-12345" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                    <SelectValue
                      placeholder={
                        isLoadingMaterials
                          ? "Loading materials..."
                          : (materialsData?.items?.length === 0 || !materialsData?.items)
                          ? "No materials available"
                          : "Select a material"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {materialsData?.items?.map((material: Material) => (
                    <SelectItem
                      key={material._id ?? material.id}
                      value={material._id ?? material.id}
                    >
                      {material.materialNumber} – {material.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          {/* Target FG Qty */}
          <FormField
            control={form.control}
            name="targetFGQty"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Target Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Existing Stock */}
          <FormField
            control={form.control}
            name="existingStockQty"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Existing Stock</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Due Date */}
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Due Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Order
        </Button>
      </form>
    </Form>
  );
};
