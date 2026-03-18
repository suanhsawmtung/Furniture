import { deletePayment } from "../api";
import { paymentQueryKeys } from "../key";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeletePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePayment(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: paymentQueryKeys.all });
      toast.success(data.message || "Payment deleted successfully.");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete payment.");
    },
  });
};
