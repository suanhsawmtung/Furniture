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
import type { RefundFilterFormValues } from "@/types/refund.type";
import { RefundFilterFormSchema } from "@/validations/refund.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";

const REFUND_STATUSES = [
  { key: "PENDING", text: "Pending" },
  { key: "SUCCESS", text: "Success" },
  { key: "FAILED", text: "Failed" },
  { key: "VOIDED", text: "Voided" },
];

export function RefundFilterForm({ close }: { close: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm<RefundFilterFormValues>({
    resolver: zodResolver(RefundFilterFormSchema),
    defaultValues: {
      search: "",
      status: undefined,
    },
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const search = searchParams.get("search") || "";
    const statusParam = searchParams.get("status") as any;
    
    form.reset({
      search,
      status: statusParam || undefined,
    });
  }, [location.search, form]);

  const onSubmit = (data: RefundFilterFormValues) => {
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
                <Input placeholder="Search by order code or reason..." {...field} />
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
                  {REFUND_STATUSES.map((stat) => (
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
