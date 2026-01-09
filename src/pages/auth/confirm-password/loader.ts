import { useAuthStore } from "@/stores/auth.store";
import { redirect } from "react-router";

// Loader for confirm-password page - check authFlow state and redirect if needed
export async function loader() {
  const { authFlow, authUser } = useAuthStore.getState();

  // If user is authenticated, they shouldn't access confirm-password
  if (authUser) {
    return redirect("/");
  }

  // If no authFlow, redirect to sign-up
  if (!authFlow) {
    return redirect("/sign-up");
  }

  // Must be sign-up flow with confirm-password status
  if (authFlow.flow === "sign-up" && authFlow.status === "confirm-password") {
    return null;
  }

  // Redirect based on flow and status
  if (authFlow.flow === "sign-up") {
    if (authFlow.status === "sign-up") {
      return redirect("/sign-up");
    }
    if (authFlow.status === "verify-otp") {
      return redirect("/verify-otp");
    }
  }

  // If flow is forgot-password, redirect to appropriate page
  if (authFlow.flow === "forgot-password") {
    if (authFlow.status === "forgot-password") {
      return redirect("/forgot-password");
    }
    if (authFlow.status === "verify-otp") {
      return redirect("/verify-password-otp");
    }
    if (authFlow.status === "reset-password") {
      return redirect("/reset-password");
    }
  }

  // Default: redirect to sign-up
  return redirect("/sign-up");
}
