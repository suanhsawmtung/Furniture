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
import { paymentFilterFormSchema } from "@/validations/payment.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import type z from "zod";

type FilterValues = z.infer<typeof paymentFilterFormSchema>;

const PAYMENT_STATUSES = [
  { key: "PENDING", text: "Pending" },
  { key: "SUCCESS", text: "Success" },
  { key: "FAILED", text: "Failed" },
  { key: "VOIDED", text: "Voided" },
];

const PAYMENT_METHODS = [
  { key: "BANK_TRANSFER", text: "Bank" },
  { key: "CASH", text: "Cash" },
  { key: "CARD", text: "Card" },
  { key: "E_WALLET", text: "E-Wallet" },
];

export function PaymentFilterForm({ close }: { close: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const form = useForm<FilterValues>({
    resolver: zodResolver(paymentFilterFormSchema),
    defaultValues: {
      search: "",
      status: undefined,
      method: undefined,
    },
  });

  useEffect(() => {
    const search = searchParams.get("search") || "";
    const statusParam = searchParams.get("status") as any;
    const methodParam = searchParams.get("method") as any;
    
    form.reset({
      search,
      status: statusParam || undefined,
      method: methodParam || undefined,
    });
  }, [searchParams, form]);

  function onSubmit(values: FilterValues) {
    const params = new URLSearchParams(searchParams);
    params.delete("page");

    if (values.search && values.search.trim()) {
      params.set("search", values.search.trim());
    } else {
      params.delete("search");
    }

    if (values.status) {
      params.set("status", values.status);
    } else {
      params.delete("status");
    }
    
    if (values.method) {
      params.set("method", values.method);
    } else {
      params.delete("method");
    }

    const queryString = params.toString();
    navigate(`${location.pathname}${queryString ? `?${queryString}` : ""}`, {
      replace: true,
    });

    close();
  }

  function handleClear() {
    form.reset({
      search: "",
      status: undefined,
      method: undefined,
    });
    navigate(location.pathname, { replace: true });
    close();
  }

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
                <Input placeholder="Search reference, note, order code..." {...field} />
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
                  {PAYMENT_STATUSES.map((stat) => (
                    <TabButton
                      key={stat.key}
                      text={stat.text}
                      isSelected={field.value === stat.key}
                      onClick={() => {
                        if (field.value === stat.key) {
                          field.onChange(undefined);
                        } else {
                          field.onChange(stat.key);
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
          name="method"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Method</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2">
                  {PAYMENT_METHODS.map((met) => (
                    <TabButton
                      key={met.key}
                      text={met.text}
                      isSelected={field.value === met.key}
                      onClick={() => {
                        if (field.value === met.key) {
                          field.onChange(undefined);
                        } else {
                          field.onChange(met.key);
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
