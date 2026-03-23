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
import type { TransactionFilterFormValues } from "@/types/transaction.type";
import { TransactionFilterFormSchema } from "@/validations/transaction.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";

const TRANSACTION_TYPES = [
  { key: "PAYMENT", text: "Payment" },
  { key: "REFUND", text: "Refund" },
  { key: "ADJUSTMENT", text: "Adjustment" },
  { key: "REVERSAL", text: "Reversal" },
  { key: "EXPENSE", text: "Expense" },
  { key: "WITHDRAWAL", text: "Withdrawal" },
  { key: "OTHER", text: "Other" },
];

const TRANSACTION_DIRECTIONS = [
  { key: "IN", text: "In" },
  { key: "OUT", text: "Out" },
];

export function TransactionFilterForm({ close }: { close: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm<TransactionFilterFormValues>({
    resolver: zodResolver(TransactionFilterFormSchema),
    defaultValues: {
      search: "",
      type: undefined,
      direction: undefined,
    },
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const search = searchParams.get("search") || "";
    const typeParam = searchParams.get("type") as any;
    const directionParam = searchParams.get("direction") as any;
    
    form.reset({
      search,
      type: typeParam || undefined,
      direction: directionParam || undefined,
    });
  }, [location.search, form]);

  const onSubmit = (data: TransactionFilterFormValues) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete("page");

    if (data.search && data.search.trim()) {
      searchParams.set("search", data.search.trim());
    } else {
      searchParams.delete("search");
    }

    if (data.type) {
      searchParams.set("type", data.type);
    } else {
      searchParams.delete("type");
    }

    if (data.direction) {
      searchParams.set("direction", data.direction);
    } else {
      searchParams.delete("direction");
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
      type: undefined,
      direction: undefined,
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
                <Input placeholder="Search source, reference, note, ..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2">
                  {TRANSACTION_TYPES.map((type) => (
                    <TabButton
                      key={type.key}
                      text={type.text}
                      isSelected={field.value === type.key}
                      onClick={() => {
                        if (field.value === type.key) {
                          field.onChange(undefined);
                        } else {
                          field.onChange(type.key);
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
          name="direction"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Direction</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2">
                  {TRANSACTION_DIRECTIONS.map((dir) => (
                    <TabButton
                      key={dir.key}
                      text={dir.text}
                      isSelected={field.value === dir.key}
                      onClick={() => {
                        if (field.value === dir.key) {
                          field.onChange(undefined);
                        } else {
                          field.onChange(dir.key);
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
