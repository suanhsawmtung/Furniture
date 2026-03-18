import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TabButton } from "@/components/ui/tab-button";
import { Textarea } from "@/components/ui/textarea";
import { PAYMENT_METHODS } from "@/constants/payment.constant";
import { paymentSchema, updatePaymentSchema, type PaymentFormValues } from "@/validations/payment.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

interface PaymentFormProps {
  initialValues?: Partial<PaymentFormValues> & { order?: { code: string } | null };
  onSubmit: (values: PaymentFormValues) => void;
  isLoading?: boolean;
  isUpdate?: boolean;
}

export function PaymentForm({
  initialValues,
  onSubmit,
  isLoading,
  isUpdate,
}: PaymentFormProps) {
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(isUpdate ? updatePaymentSchema : paymentSchema) as any,
    defaultValues: {
      orderCode: initialValues?.orderCode || initialValues?.order?.code || "",
      method: initialValues?.method || "BANK_TRANSFER",
      amount: initialValues?.amount || 0,
      reference: initialValues?.reference || "",
      note: initialValues?.note || "",
      paidAt: initialValues?.paidAt ? new Date(initialValues.paidAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    },
  });

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
                    placeholder="Enter order code"
                    {...field}
                    disabled={isLoading || isUpdate}
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
                    disabled={isLoading || isUpdate}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-2">
                <FormLabel>Payment Method</FormLabel>
                <FormControl>
                  <div className="flex flex-wrap gap-2">
                    {PAYMENT_METHODS.map((method) => (
                      <TabButton
                        key={method.key}
                        text={method.text}
                        isSelected={field.value === method.key}
                        onClick={() => field.onChange(method.key)}
                        disabled={isLoading}
                      />
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reference (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Transaction ID, etc." {...field} value={field.value || ""} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paidAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paid At (Optional)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value || ""} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Internal Note (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional information..."
                  className="resize-none min-h-[100px]"
                  {...field}
                  value={field.value || ""}
                  disabled={isLoading}
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
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
            {isUpdate ? "Update Payment" : "Record Payment"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
