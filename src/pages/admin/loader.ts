import { checkAuth } from "@/services/auth/api";
import { useAuthStore } from "@/stores/auth.store";
import { redirect } from "react-router";

// Loader for admin pages - check if user is authenticated and has admin role
// If not authenticated, redirect to sign-in
// If authenticated but not admin, redirect to home
export async function loader() {
  const { authUser, setAuthUser, clearAuthUser } = useAuthStore.getState();

  // If authUser exists in store, check role directly
  if (authUser) {
    // Check if user has admin role
    if (authUser.role === "ADMIN") {
      return null; // Allow access
    } else {
      // User is authenticated but not admin, redirect to home
      return redirect("/");
    }
  }

  // If authUser doesn't exist, verify authentication with API
  const { user, isSuccess } = await checkAuth();

  // If authenticated, sync with store and check role
  if (isSuccess && user) {
    // Set authUser in store
    setAuthUser(user);

    // Check if user has admin role
    if (user.role === "ADMIN") {
      return null; // Allow access
    } else {
      // User is authenticated but not admin, redirect to home
      return redirect("/");
    }
  }

  // If not authenticated, redirect to sign-in
  clearAuthUser();
  return redirect("/sign-in");
}
