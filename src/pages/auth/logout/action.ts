import api from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import { AxiosError } from "axios";
import { redirect } from "react-router";
import { toast } from "sonner";

// Action for logout
export async function action() {
  try {
    const response = await api.post("/auth/logout");

    // Show success toast
    toast.success(response.data?.message || "Successfully logged out");
  } catch (error) {
    // Even if logout API fails, clear local auth data
    if (error instanceof AxiosError) {
      const errorData = error.response?.data;
      toast.error(errorData?.message || "Logout failed");
      console.error("Logout error:", errorData || error.message);
    }
  } finally {
    // Always clear auth store data
    const { clearAuth } = useAuthStore.getState();
    clearAuth();
  }

  // Redirect to sign-in page
  return redirect("/sign-in");
}
