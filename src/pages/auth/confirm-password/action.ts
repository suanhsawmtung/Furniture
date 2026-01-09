import api from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import { AxiosError } from "axios";
import { redirect, type ActionFunctionArgs } from "react-router";
import { toast } from "sonner";

// Action for confirm-password form submission
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const password = formData.get("password") as string;

  // Get authFlow from store
  const { authFlow } = useAuthStore.getState();

  // If no authFlow, redirect to sign-up
  if (!authFlow) {
    return redirect("/sign-up");
  }

  const { email, token } = authFlow;

  try {
    const response = await api.post("/auth/confirm-password", {
      email,
      password,
      token,
    });

    // On success, set authUser and redirect to home
    if (response.data?.success && response.data?.data) {
      const { setAuthUser, setAuthFlow } = useAuthStore.getState();

      // Set authenticated user
      setAuthUser(response.data.data);

      // Clear authFlow since registration is complete
      setAuthFlow(null);

      // Show success toast
      toast.success(
        response.data?.message ||
          "Successfully confirmed your account password.",
      );

      return redirect("/");
    }

    return { success: true, data: response.data };
  } catch (error: any) {
    if (error instanceof AxiosError) {
      const errorData = error.response?.data;
      const errorCode = errorData?.error;

      // Handle specific error codes - redirect to forgot-password
      if (
        errorCode === "Error_OtpNotExist" ||
        errorCode === "Error_OtpNotVerified" ||
        errorCode === "Error_OtpErrorCountLimitExceeded" ||
        errorCode === "Error_InvalidToken" ||
        errorCode === "Error_ExpiredOtp"
      ) {
        toast.error(errorData?.message || "Password confirmation failed");
        return redirect("/sign-up");
      }

      // Handle Error_UserAlreadyExists - redirect to sign-in
      if (errorCode === "Error_UserAlreadyExists") {
        toast.error(errorData?.message || "User already exists");
        return redirect("/sign-in");
      }

      // Return error for display
      return {
        success: false,
        error: errorCode,
        message: errorData?.message || "Password confirmation failed",
      };
    }
    throw error;
  }
}
