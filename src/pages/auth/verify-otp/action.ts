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
      const { clearAuth, updateAuthFlow } = useAuthStore.getState();

      if (flow === "sign-up") {
        // Move to confirm-password step and update email/token
        clearAuth();
        // Show success toast
        toast.success(
          // response.data?.message || "OTP is successfully verified.***",
          "OTP is successfully verified.***"
        );
        return redirect("/");
      } else {
        // Move to reset-password step and update email/token
        updateAuthFlow({
          email,
          token: response.data.data.token,
          status: "reset-password",
          flow: "forgot-password",
        });

        // Show success toast
        toast.success(
          // response.data?.message || "OTP is successfully verified...",
          "OTP is successfully verified..."
        );
        return redirect("/reset-password");
      }
    }

    return { success: true, data: response.data };
  } catch (error: any) {
    if (error instanceof AxiosError) {
      const errorData = error.response?.data;

      // Redirect to previous page based on flow
      const redirectPath =
        flow === "sign-up" ? "/sign-up" : "/forgot-password";
      toast.error(errorData?.message || "Verification failed");
      return redirect(redirectPath);
    }
    throw error;
  }
}
