import api from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import { AxiosError } from "axios";
import { redirect, type ActionFunctionArgs } from "react-router";
import { toast } from "sonner";

// Action for reset-password form submission
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const password = formData.get("password") as string;

  // Get authFlow from store
  const { authFlow } = useAuthStore.getState();

  // If no authFlow, redirect to forgot-password
  if (!authFlow) {
    return redirect("/forgot-password");
  }

  const { email, token } = authFlow;

  try {
    const response = await api.post("/auth/reset-password", {
      email,
      password,
      token,
    });

    // On success, clear authFlow and redirect to sign-in
    if (response.data?.success) {
      const { clearAuth } = useAuthStore.getState();

      // Clear authFlow since password reset is complete
      clearAuth();

      // Show success toast
      toast.success(
        response.data?.message ||
          "Password reset successfully. Please sign in.",
      );

      return redirect("/sign-in");
    }

    return { success: true, data: response.data };
  } catch (error: any) {
    if (error instanceof AxiosError) {
      const errorData = error.response?.data;
      const errorCode = errorData?.error;

      // Handle specific error codes - redirect to forgot-password
      if (
        errorCode === "Error_UserNotFound" ||
        errorCode === "Error_OtpNotExist" ||
        errorCode === "Error_InvalidToken" ||
        errorCode === "Error_ExpiredOtp" ||
        errorCode === "Error_OtpErrorCountLimitExceeded"
      ) {
        toast.error(errorData?.message || "Password reset failed");
        return redirect("/forgot-password");
      }

      // Return error for display
      return {
        success: false,
        error: errorCode,
        message: errorData?.message || "Password reset failed",
      };
    }
    throw error;
  }
}
