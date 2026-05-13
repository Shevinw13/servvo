/**
 * Zustand store for managing authentication state.
 * Holds the access token, user info, and provides actions to update auth state.
 */

import { create } from 'zustand';

export interface User {
  id: string;
  phone: string;
  name: string | null;
  email: string | null;
  onboarding_complete: boolean;
  business_id: string;
}

export interface AuthState {
  /** The current JWT access token, or null if not authenticated */
  accessToken: string | null;
  /** The authenticated user, or null if not authenticated */
  user: User | null;
  /** Whether the user is currently authenticated */
  isAuthenticated: boolean;
  /** Whether an auth operation is in progress */
  isLoading: boolean;
  /** Set auth state after successful login */
  setAuth: (token: string, user: User) => void;
  /** Clear auth state on logout or session expiry */
  clearAuth: () => void;
  /** Set loading state during auth operations */
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setAuth: (token: string, user: User) =>
    set({
      accessToken: token,
      user,
      isAuthenticated: true,
      isLoading: false,
    }),
  clearAuth: () =>
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));
