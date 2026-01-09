import api from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import { AxiosError } from "axios";
import { redirect, type ActionFunctionArgs } from "react-router";
import { toast } from "sonner";

// Action for resend OTP
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;

  // Get authFlow from store
  const { authFlow } = useAuthStore.getState();

  // If no authFlow, redirect to sign-up
  if (!authFlow) {
    return redirect("/sign-up");
  }

  try {
    const response = await api.post("/auth/resend-otp", {
      email,
    });

    // On success, update authFlow with new token
    if (response.data?.success && response.data?.data) {
      const { updateAuthFlow } = useAuthStore.getState();
      updateAuthFlow({
        email: response.data.data.email,
        token: response.data.data.token,
      });

      // Show success toast
      toast.success(
        response.data?.message || "OTP has been resent successfully.",
      );
    }

    return { success: true, message: "OTP has been resent successfully." };
  } catch (error: any) {
    if (error instanceof AxiosError) {
      const errorData = error.response?.data;
      const errorMessage = errorData?.message || "Failed to resend OTP";

      // Show error toast
      toast.error(errorMessage);

      return {
        success: false,
        error: errorData?.error,
        message: errorMessage,
      };
    }
    throw error;
  }
}
