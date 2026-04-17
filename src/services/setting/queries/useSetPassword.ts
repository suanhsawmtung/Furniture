import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { setPassword } from "../api";
import { settingQueryKeys } from "../key";

export function useSetPassword() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: setPassword,
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: settingQueryKeys.all });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to set password");
    },
  });
}
