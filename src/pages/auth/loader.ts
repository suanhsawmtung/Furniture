import { checkAuth } from "@/services/auth/api";
import { useAuthStore } from "@/stores/auth.store";
import { redirect } from "react-router";

// Loader for auth pages - check if user is already authenticated
// If authenticated, redirect to home page
export async function loader() {
  const { authUser, setAuthUser, clearAuthUser } = useAuthStore.getState();

  // If authUser already exists in store, redirect to home
  if (authUser) {
    return redirect("/");
  }

  // If authUser doesn't exist, check authentication with API
  const { user, isSuccess } = await checkAuth();

  // If authenticated, sync with store and redirect to home page
  if (isSuccess && user) {
    setAuthUser(user);
    return redirect("/");
  }

  // If not authenticated, clear authUser and allow access to auth pages
  clearAuthUser();
  return null;
}
