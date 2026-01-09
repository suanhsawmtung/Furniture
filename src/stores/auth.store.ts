import type { UserType } from "@/types/user.type";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

// Auth status types - represents the current step in the auth flow
export type AuthStatus =
  | "sign-up"
  | "verify-otp"
  | "confirm-password"
  | "forgot-password"
  | "reset-password";

// Auth flow types - represents which flow the user is in
export type AuthFlow = "sign-up" | "forgot-password";

// Auth user type - matches backend response
export interface AuthUser extends UserType {}

// Auth flow state - tracks the current flow and step
export interface AuthFlowState {
  email: string;
  token: string;
  status: AuthStatus;
  flow: AuthFlow;
}

// Auth store state
interface AuthState {
  // Authenticated user (null when not authenticated)
  authUser: AuthUser | null;
  // Auth flow state - tracks multi-step auth processes
  authFlow: AuthFlowState | null;
  // Actions
  setAuthUser: (user: AuthUser | null) => void;
  setAuthFlow: (flow: AuthFlowState | null) => void;
  updateAuthFlow: (updates: Partial<AuthFlowState>) => void;
  clearAuthUser: () => void;
  clearAuth: () => void;
}

const initialState = {
  authUser: null,
  authFlow: null,
};

export const useAuthStore = create<AuthState>()(
  persist(
    immer((set) => ({
      ...initialState,

      // Set authenticated user
      setAuthUser: (user) =>
        set((state) => {
          state.authUser = user;
        }),

      // Set auth flow state
      setAuthFlow: (flow) =>
        set((state) => {
          state.authFlow = flow;
        }),

      // Update auth flow state (partial update)
      updateAuthFlow: (updates) =>
        set((state) => {
          if (state.authFlow) {
            Object.assign(state.authFlow, updates);
          }
        }),

      // Clear authenticated user only
      clearAuthUser: () =>
        set((state) => {
          state.authUser = null;
        }),

      // Clear all auth data
      clearAuth: () =>
        set((state) => {
          state.authUser = null;
          state.authFlow = null;
        }),
    })),
    {
      name: "auth-storage", // unique name for sessionStorage key
      storage: createJSONStorage(() => sessionStorage), // use sessionStorage
    },
  ),
);
