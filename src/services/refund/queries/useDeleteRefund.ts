import { queryClient } from "@/lib/query-client";
import { deleteRefund } from "@/services/refund/api";
import { refundQueryKeys } from "@/services/refund/key";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export const useDeleteRefundMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: deleteRefund,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: refundQueryKeys.all });
      toast.success(response.message || "Refund deleted successfully");
      navigate("/admin/refunds");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete refund");
    },
  });
};
