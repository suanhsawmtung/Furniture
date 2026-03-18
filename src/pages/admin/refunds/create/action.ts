import { queryClient } from "@/lib/query-client";
import { createRefund } from "@/services/refund/api";
import { refundQueryKeys } from "@/services/refund/key";
import { AxiosError } from "axios";
import { redirect, type ActionFunctionArgs } from "react-router";
import { toast } from "sonner";

// Action for creating a refund
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const orderCode = formData.get("orderCode") as string;
  const amount = formData.get("amount") as string;
  const reason = formData.get("reason") as string;

  if (!orderCode || orderCode.trim().length === 0) {
    toast.error("Order code is required");
    return { error: "Order code is required" };
  }

  if (!amount || amount.trim().length === 0) {
    toast.error("Amount is required");
    return { error: "Amount is required" };
  }

  if (!reason || reason.trim().length === 0) {
    toast.error("Reason is required");
    return { error: "Reason is required" };
  }

  try {
    const response = await createRefund({
      orderCode: orderCode,
      amount: Number(amount),
      reason: reason,
    });

    await queryClient.invalidateQueries({
      queryKey: refundQueryKeys.all,
    });

    toast.success(response.message || "Refund created successfully");

    return redirect("/admin/refunds");
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorData = error.response?.data;
      toast.error(errorData?.message || "Failed to create refund");
      return { error: errorData?.message || "Failed to create refund" };
    }
    throw error;
  }
}
