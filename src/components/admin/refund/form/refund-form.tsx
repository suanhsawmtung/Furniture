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
import { Textarea } from "@/components/ui/textarea";
import { REFUND_STATUSES } from "@/constants/refund.constant";
import type { RefundType } from "@/types/refund.type";
import { refundSchema, updateRefundSchema } from "@/validations/refund.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigation, useSubmit } from "react-router";

interface RefundFormProps {
  refund?: RefundType;
}

export function RefundForm({
  refund,
}: RefundFormProps) {
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const isUpdate = !!refund;
  
  const form = useForm<any>({
    resolver: zodResolver(isUpdate ? updateRefundSchema : refundSchema),
    defaultValues: refund ? {
      orderCode: refund.order?.code || "",
      amount: refund.amount,
      reason: refund.reason || "",
      status: refund.status,
    } : {
      orderCode: "",
      amount: undefined,
      reason: "",
      status: "PENDING",
    },
  });

  const onSubmit = (values: any) => {
    const formData = new FormData();
    
    // Only send orderCode and amount if NOT updating
    if (!isUpdate) {
        formData.append("orderCode", values.orderCode);
        formData.append("amount", String(values.amount));
    }
    
    formData.append("reason", values.reason);
    formData.append("status", values.status || "PENDING");

    submit(formData, {
      method: isUpdate ? "PATCH" : "POST",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="orderCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Order Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Order Code"
                    {...field}
                    disabled={isSubmitting || isUpdate}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    disabled={isSubmitting || isUpdate}
                  />
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
                           field.onChange(stat.key);
                        }}
                        disabled={isSubmitting}
                      />
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Reason for refund..."
                  className="min-h-[120px]"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            {isUpdate ? "Update Refund" : "Create Refund"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
