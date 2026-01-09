import api from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import { AxiosError } from "axios";
import { redirect, type ActionFunctionArgs } from "react-router";
import { toast } from "sonner";

// Action for sign-in form submission
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const response = await api.post("/auth/sign-in", {
      email,
      password,
    });

    if (response.status !== 200) {
      return { error: response.data || "Login Failed!" };
    }

    // Set authenticated user in store before redirect
    if (response.data?.data) {
      const { setAuthUser } = useAuthStore.getState();
      console.log(response.data.data, "hit");
      setAuthUser(response.data.data);
    }

    // Show success toast
    toast.success(response.data?.message || "Successfully signed in");

    const redirectTo = new URL(request.url).searchParams.get("redirect") || "/";
    return redirect(redirectTo);
    // Handle success (store token, redirect, etc.)
    // localStorage.setItem("token", response.data.token);
    // return redirect("/");

    // return { success: true, data: response.data };
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return error.response?.data || { error: "Login Failed!" };
    } else throw error;
  }
}
