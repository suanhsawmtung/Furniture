import { queryClient } from "@/lib/query-client";
import { updatePayment } from "@/services/payment/api";
import { paymentQueryKeys } from "@/services/payment/key";
import { AxiosError } from "axios";
import { redirect, type ActionFunctionArgs } from "react-router";
import { toast } from "sonner";

export async function action({ request, params }: ActionFunctionArgs) {
  const { id } = params;
  const formData = await request.formData();

  if (!id) {
    throw new Response("Payment ID is required", { status: 400 });
  }

  const method = formData.get("method") as string;
  const reference = formData.get("reference") as string;
  const note = formData.get("note") as string;
  const paidAt = formData.get("paidAt") as string;

  try {
    const response = await updatePayment(id, {
      method: method as any,
      reference: reference || null,
      note: note || null,
      paidAt: paidAt || null,
    });

    await queryClient.invalidateQueries({
      queryKey: paymentQueryKeys.detail(id),
    });

    await queryClient.invalidateQueries({
      queryKey: paymentQueryKeys.lists(),
    });

    toast.success(response.message || "Payment updated successfully");

    return redirect("/admin/payments");
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorData = error.response?.data;
      toast.error(errorData?.message || "Failed to update payment");
      return { error: errorData?.message || "Failed to update payment" };
    }
    throw error;
  }
}
