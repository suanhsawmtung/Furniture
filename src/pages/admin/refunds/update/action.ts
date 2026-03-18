import { queryClient } from "@/lib/query-client";
import { updateRefund } from "@/services/refund/api";
import { refundQueryKeys } from "@/services/refund/key";
import { AxiosError } from "axios";
import { redirect, type ActionFunctionArgs } from "react-router";
import { toast } from "sonner";

// Action for updating a refund
export async function action({ request, params }: ActionFunctionArgs) {
  const { id } = params;
  const formData = await request.formData();

  if (!id) {
    throw new Response("Refund ID is required", { status: 400 });
  }

  const refundId = Number(id);

  const reason = formData.get("reason") as string;

  if (!reason || reason.trim().length === 0) {
    toast.error("Reason is required");
    return { error: "Reason is required" };
  }

  try {
    const response = await updateRefund(refundId, {
      reason,
    });

    // Invalidate queries
    await queryClient.invalidateQueries({
      queryKey: refundQueryKeys.detail(refundId),
    });

    await queryClient.invalidateQueries({
      queryKey: refundQueryKeys.lists(),
    });

    // Show success toast
    toast.success(response.message || "Refund updated successfully");

    // Redirect to refunds list page
    return redirect("/admin/refunds");
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorData = error.response?.data;
      toast.error(errorData?.message || "Failed to update refund");
      return { error: errorData?.message || "Failed to update refund" };
    }
    throw error;
  }
}
