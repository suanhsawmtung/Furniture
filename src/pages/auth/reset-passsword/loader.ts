import { useAuthStore } from "@/stores/auth.store";
import { redirect } from "react-router";

// Loader for reset-password page - check authFlow state and redirect if needed
export async function loader() {
  const { authFlow, authUser } = useAuthStore.getState();

  // If user is authenticated, they shouldn't access reset-password
  if (authUser) {
    return redirect("/");
  }

  // If no authFlow, redirect to forgot-password
  if (!authFlow) {
    return redirect("/forgot-password");
  }

  // Must be forgot-password flow with reset-password status
  if (
    authFlow.flow === "forgot-password" &&
    authFlow.status === "reset-password"
  ) {
    return null;
  }

  // Redirect based on flow and status
  if (authFlow.flow === "forgot-password") {
    if (authFlow.status === "forgot-password") {
      return redirect("/forgot-password");
    }
    if (authFlow.status === "verify-otp") {
      return redirect("/verify-password-otp");
    }
  }

  // If flow is sign-up, redirect to appropriate page
  if (authFlow.flow === "sign-up") {
    if (authFlow.status === "sign-up") {
      return redirect("/sign-up");
    }
    if (authFlow.status === "verify-otp") {
      return redirect("/verify-otp");
    }
    if (authFlow.status === "confirm-password") {
      return redirect("/confirm-password");
    }
  }

  // Default: redirect to forgot-password
  return redirect("/forgot-password");
}
