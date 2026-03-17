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
import { TabButton } from "@/components/ui/tab-button";
import { isOrderSource, isOrderStatus, isPaymentStatus } from "@/lib/utils";
import type { OrderFilterFormValues, OrderPaymentStatus, OrderSource, OrderStatus } from "@/types/order.type";
import { orderFilterFormSchema } from "@/validations/order.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";

const orderStatusOptions: Array<{ key: OrderStatus; text: string }> = [
  { key: "PENDING", text: "Pending" },
  { key: "ACCEPTED", text: "Accepted" },
  { key: "REJECTED", text: "Rejected" },
  { key: "CANCELLED", text: "Cancelled" },
  { key: "DONE", text: "Done" },
];

const paymentStatusOptions: Array<{ key: OrderPaymentStatus; text: string }> = [
  { key: "PENDING", text: "Pending" },
  { key: "UNPAID", text: "Unpaid" },
  { key: "PAID", text: "Paid" },
  { key: "FAILED", text: "Failed" },
  { key: "REFUNDED", text: "Refunded" },
  { key: "PARTIALLY_REFUNDED", text: "Partially Refunded" },
];

const orderSourceOptions: Array<{ key: OrderSource; text: string }> = [
  { key: "ADMIN", text: "Admin" },
  { key: "CUSTOMER", text: "Customer" },
];

export function OrderFilterForm({ close }: { close: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm<OrderFilterFormValues>({
    resolver: zodResolver(orderFilterFormSchema),
    defaultValues: {
      search: "",
      status: undefined,
      paymentStatus: undefined,
      source: undefined,
    },
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const search = searchParams.get("search") || "";
    const statusParam = searchParams.get("status");
    const paymentStatusParam = searchParams.get("paymentStatus");
    const sourceParam = searchParams.get("source");

    form.reset({
      search,
      status: isOrderStatus(statusParam) ? statusParam : undefined,
      paymentStatus: isPaymentStatus(paymentStatusParam) ? paymentStatusParam : undefined,
      source: isOrderSource(sourceParam) ? sourceParam : undefined,
    });
  }, [location.search, form]);

  const onSubmit = (data: OrderFilterFormValues) => {
    const searchParams = new URLSearchParams(location.search);

    searchParams.delete("page");

    if (data.search && data.search.trim()) {
      searchParams.set("search", data.search.trim());
    } else {
      searchParams.delete("search");
    }

    if (data.status) {
      searchParams.set("status", data.status);
    } else {
      searchParams.delete("status");
    }

    if (data.paymentStatus) {
      searchParams.set("paymentStatus", data.paymentStatus);
    } else {
      searchParams.delete("paymentStatus");
    }

    if (data.source) {
      searchParams.set("source", data.source);
    } else {
      searchParams.delete("source");
    }

    const queryString = searchParams.toString();
    navigate(`${location.pathname}${queryString ? `?${queryString}` : ""}`, {
      replace: true,
    });

    close();
  };

  const handleClear = () => {
    form.reset({
      search: "",
      status: undefined,
      paymentStatus: undefined,
      source: undefined,
    });
    navigate(location.pathname, { replace: true });
    close();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Search</FormLabel>
              <FormControl>
                <Input placeholder="Search orders..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2">
                  {orderStatusOptions.map((option) => (
                    <TabButton
                      key={option.key}
                      text={option.text}
                      isSelected={field.value === option.key}
                      onClick={() => {
                        if (field.value === option.key) {
                          field.onChange(undefined);
                        } else {
                          field.onChange(option.key);
                        }
                      }}
                    />
                  ))}
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Status</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2">
                  {paymentStatusOptions.map((option) => (
                    <TabButton
                      key={option.key}
                      text={option.text}
                      isSelected={field.value === option.key}
                      onClick={() => {
                        if (field.value === option.key) {
                          field.onChange(undefined);
                        } else {
                          field.onChange(option.key);
                        }
                      }}
                    />
                  ))}
                </div>
              </FormControl>
            </FormItem>
          )}
        />

         <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2">
                  {orderSourceOptions.map((option) => (
                    <TabButton
                      key={option.key}
                      text={option.text}
                      isSelected={field.value === option.key}
                      onClick={() => {
                        if (field.value === option.key) {
                          field.onChange(undefined);
                        } else {
                          field.onChange(option.key);
                        }
                      }}
                    />
                  ))}
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleClear}>
            Clear
          </Button>
          <Button type="submit">Apply</Button>
        </div>
      </form>
    </Form>
  );
}
