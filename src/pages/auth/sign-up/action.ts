import api from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import { AxiosError } from "axios";
import { redirect, type ActionFunctionArgs } from "react-router";
import { toast } from "sonner";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;

  try {
    const response = await api.post("/auth/register", {
      email,
      password,
      firstName,
      lastName,
    });

    if (response.data?.success && response.data?.data) {
      const { setAuthFlow } = useAuthStore.getState();
      setAuthFlow({
        email: response.data.data.email,
        token: response.data.data.token,
        status: "verify-otp",
        flow: "sign-up",
      });

      toast.success(
        response.data?.message ||
          "Sign up successful. Please verify your email.",
      );
    }

    return redirect("/verify-otp");
  } catch (error: any) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data?.message || "Sign up failed");
      return error.response?.data || { error: "Sign up failed" };
    }
    throw error;
  }
}
