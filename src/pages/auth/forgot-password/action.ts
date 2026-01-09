import api from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import { AxiosError } from "axios";
import { redirect, type ActionFunctionArgs } from "react-router";
import { toast } from "sonner";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;

  try {
    const response = await api.post("/auth/forgot-password", {
      email,
    });

    // Update auth flow in store when successful
    if (response.data?.success && response.data?.data) {
      const { setAuthFlow } = useAuthStore.getState();
      setAuthFlow({
        email: response.data.data.email,
        token: response.data.data.token,
        status: "verify-otp",
        flow: "forgot-password",
      });

      // Show success toast
      toast.success(
        response.data?.message || "Password reset otp sent to your email.",
      );
    }

    // Redirect to verify-otp page
    return redirect("/verify-password-otp");
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return error.response?.data || { error: "Forgot password failed" };
    }
    throw error;
  }
}
