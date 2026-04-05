import { useAuthStore } from "@/stores/auth.store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateMe } from "../api";
import { settingQueryKeys } from "../key";

export function useProfileInfoUpdate() {
  const queryClient = useQueryClient();
  const { setAuthUser } = useAuthStore.getState();

  return useMutation({
    mutationFn: updateMe,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: settingQueryKeys.me() });
      setAuthUser(response.data);
      toast.success(response.message);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });
}
