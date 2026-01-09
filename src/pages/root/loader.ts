import { checkAuth } from "@/services/auth/api";
import { useAuthStore } from "@/stores/auth.store";

// Loader for root layout - sync authUser with store if authenticated
// No redirects, just sync the store
export async function loader() {
  const { authUser, setAuthUser } = useAuthStore.getState();

  // If authUser already exists in store, no need to call API
  if (authUser) {
    return null;
  }

  // If authUser doesn't exist, check authentication with API
  const { user, isSuccess } = await checkAuth();

  // If authenticated, sync with store
  if (isSuccess && user) {
    setAuthUser(user);
  }

  return null;
}
