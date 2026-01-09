import { useAuthStore } from "@/stores/auth.store";
import { redirect } from "react-router";

// Loader for verify-otp page - check authFlow state and redirect if needed
export async function loader() {
  const { authFlow, authUser } = useAuthStore.getState();

  // If user is authenticated, they shouldn't access verify-otp
  if (authUser) {
    return redirect("/");
  }

  // If no authFlow, redirect to sign-up
  if (!authFlow) {
    return redirect("/sign-up");
  }

  // If status is verify-otp, allow access (works for both sign-up and forgot-password flows)
  if (authFlow.status === "verify-otp") {
    return null;
  }

  // Redirect based on flow and status
  if (authFlow.flow === "sign-up") {
    if (authFlow.status === "sign-up") {
      return redirect("/sign-up");
    }
    if (authFlow.status === "confirm-password") {
      return redirect("/confirm-password");
    }
  }

  if (authFlow.flow === "forgot-password") {
    if (authFlow.status === "forgot-password") {
      return redirect("/forgot-password");
    }
    if (authFlow.status === "reset-password") {
      return redirect("/reset-password");
    }
  }

  // Default: redirect to sign-up if flow/status doesn't match
  return redirect("/sign-up");
}
