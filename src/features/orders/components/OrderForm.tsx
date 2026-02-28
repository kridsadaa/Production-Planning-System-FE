import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { orderSchema } from "../types";
import type { Order } from "../types";
import { useCreateOrder } from "../hooks/useOrders";
import { useMaterials } from "@/features/materials/hooks/useMaterials";
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

interface OrderFormProps {
  onSuccess: () => void;
}

export const OrderForm = ({ onSuccess }: OrderFormProps) => {
  const { data: materialsData, isLoading: isLoadingMaterials } = useMaterials({ limit: 100 });
  const { mutate: createOrder, isPending } = useCreateOrder();

  const form = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      orderNumber: `ORD-${Math.floor(Math.random() * 10000)}`,
      partId: "",
      quantity: 1,
      priority: "medium",
      dueDate: new Date().toISOString().split("T")[0],
      status: "pending",
    },
  });

  const onSubmit = (data: any) => {
    createOrder(data, {
      onSuccess: () => {
        onSuccess();
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="orderNumber"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Order Number</FormLabel>
              <FormControl>
                <Input placeholder="ORD-2024-001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="partId"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Material / Part</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingMaterials ? "Loading materials..." : "Select a material"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {materialsData?.data?.map((material: any) => (
                    <SelectItem key={material.id} value={material.id}>
                      {material.name} ({material.sku})
                    </SelectItem>
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
            name="quantity"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={e => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
