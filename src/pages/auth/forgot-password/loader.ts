import { useAuthStore } from "@/stores/auth.store";
import { redirect } from "react-router";

// Loader for forgot-password page - check authFlow state and redirect if needed
export async function loader() {
  const { authFlow, authUser } = useAuthStore.getState();

  // If user is authenticated, they shouldn't access forgot-password
  // (This is already handled by authLoader, but keeping for safety)
  if (authUser) {
    return redirect("/");
  }

  // If no authFlow, allow access
  if (!authFlow) {
    return null;
  }

  // If authFlow exists but flow is not forgot-password, allow access
  if (authFlow.flow !== "forgot-password") {
    return null;
  }

  // If flow is forgot-password, check status and redirect accordingly
  if (authFlow.flow === "forgot-password") {
    if (authFlow.status === "forgot-password") {
      // User is at the correct step, allow access
      return null;
    }

    // Redirect based on current status
    if (authFlow.status === "verify-otp") {
      return redirect("/verify-password-otp");
    }

    if (authFlow.status === "reset-password") {
      return redirect("/reset-password");
    }
  }

  return null;
}
