import { useAuthStore } from "@/stores/auth.store";
import { redirect } from "react-router";

// Loader for sign-up page - check authFlow state and redirect if needed
export async function loader() {
  const { authFlow, authUser } = useAuthStore.getState();

  // If user is authenticated, they shouldn't access sign-up
  // (This is already handled by authLoader, but keeping for safety)
  if (authUser) {
    return redirect("/");
  }

  // If no authFlow, allow access
  if (!authFlow) {
    return null;
  }

  // If authFlow exists but flow is not sign-up, allow access
  if (authFlow.flow !== "sign-up") {
    return null;
  }

  // If flow is sign-up, check status and redirect accordingly
  if (authFlow.flow === "sign-up") {
    if (authFlow.status === "sign-up") {
      // User is at the correct step, allow access
      return null;
    }

    // Redirect based on current status
    if (authFlow.status === "verify-otp") {
      return redirect("/verify-otp");
    }

    if (authFlow.status === "confirm-password") {
      return redirect("/confirm-password");
    }
  }

  return null;
}
