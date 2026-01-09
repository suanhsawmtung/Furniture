import api from "@/lib/api";
import type { AuthUser } from "@/stores/auth.store";

export interface AuthCheckResult {
  user: AuthUser | null;
  isSuccess: boolean;
}

export async function checkAuth(): Promise<AuthCheckResult> {
  try {
    const response = await api.get("/auth-check");

    if (response.data.success && response.data.data) {
      return {
        user: response.data.data,
        isSuccess: true,
      };
    }

    return {
      user: null,
      isSuccess: false,
    };
  } catch (error: any) {
    // If not authenticated (401 or other error), return failure
    return {
      user: null,
      isSuccess: false,
    };
  }
}
