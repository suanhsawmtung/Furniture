import api from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import { AxiosError } from "axios";
import { redirect, type ActionFunctionArgs } from "react-router";
import { toast } from "sonner";

// Action for verify-otp form submission
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const otp = formData.get("otp") as string;

  // Get authFlow from store
  const { authFlow } = useAuthStore.getState();

  // If no authFlow, redirect to sign-up
  if (!authFlow) {
    return redirect("/sign-up");
  }

  const { email, token, flow } = authFlow;

  // Determine API endpoint based on flow
  const apiEndpoint =
    flow === "sign-up" ? "/auth/verify-otp" : "/auth/verify-password-otp";

  try {
    const response = await api.post(apiEndpoint, {
      email,
      otp,
      token,
    });

    // On success, update authFlow status, email, and token
    if (response.data?.success && response.data?.data) {
      const { updateAuthFlow } = useAuthStore.getState();

      if (flow === "sign-up") {
        // Move to confirm-password step and update email/token
        updateAuthFlow({
          status: "confirm-password",
          email: response.data.data.email,
          token: response.data.data.token,
        });
        // Show success toast
        toast.success(
          response.data?.message || "OTP is successfully verified.",
        );
        return redirect("/confirm-password");
      } else {
        // Move to reset-password step and update email/token
        updateAuthFlow({
          status: "reset-password",
          email: response.data.data.email,
          token: response.data.data.token,
        });
        // Show success toast
        toast.success(
          response.data?.message || "OTP is successfully verified.",
        );
        return redirect("/reset-password");
      }
    }

    return { success: true, data: response.data };
  } catch (error: any) {
    if (error instanceof AxiosError) {
      const errorData = error.response?.data;
      const errorCode = errorData?.error;

      // Handle specific error codes
      if (
        errorCode === "Error_OtpNotExist" ||
        errorCode === "Error_InvalidToken"
      ) {
        // Redirect to previous page based on flow
        const redirectPath =
          flow === "sign-up" ? "/sign-up" : "/forgot-password";
        toast.error(errorData?.message || "Verification failed");
        return redirect(redirectPath);
      }

      if (errorCode === "Error_UserAlreadyExists" && flow === "sign-up") {
        toast.error(errorData?.message || "User already exists");
        return redirect("/sign-up");
      }

      if (errorCode === "Error_UserNotFound" && flow === "forgot-password") {
        toast.error(errorData?.message || "User not found");
        return redirect("/forgot-password");
      }

      // Return error for display
      return {
        success: false,
        error: errorCode,
        message: errorData?.message || "Verification failed",
      };
    }
    throw error;
  }
}
