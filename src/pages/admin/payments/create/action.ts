import { queryClient } from "@/lib/query-client";
import { createPayment } from "@/services/payment/api";
import { paymentQueryKeys } from "@/services/payment/key";
import { AxiosError } from "axios";
import { redirect, type ActionFunctionArgs } from "react-router";
import { toast } from "sonner";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const orderCode = formData.get("orderCode");
  const method = formData.get("method") as string;
  const amount = formData.get("amount") as string;

  if (!orderCode) {
    toast.error("Order code is required");
    return { error: "Order code is required" };
  }

  if (!method) {
    toast.error("Payment method is required");
    return { error: "Payment method is required" };
  }

  if (!amount || Number(amount) <= 0) {
    toast.error("Valid amount is required");
    return { error: "Valid amount is required" };
  }

  try {
    const response = await createPayment({
      orderCode: orderCode as string,
      method: method as any,
      amount: Number(amount),
      reference: (formData.get("reference") as string) || null,
      note: (formData.get("note") as string) || null,
      paidAt: (formData.get("paidAt") as string) || null,
    });

    await queryClient.invalidateQueries({
      queryKey: paymentQueryKeys.all,
    });

    toast.success(response.message || "Payment recorded successfully");

    return redirect("/admin/payments");
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorData = error.response?.data;
      toast.error(errorData?.message || "Failed to record payment");
      return { error: errorData?.message || "Failed to record payment" };
    }
    throw error;
  }
}
