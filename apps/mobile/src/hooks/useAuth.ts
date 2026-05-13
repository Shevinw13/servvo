/**
 * Hook for managing authentication state and operations.
 * Provides login, logout, and session restoration functionality.
 */

import { useCallback } from 'react';
import { useAuthStore, User } from '../stores/authStore';
import * as authService from '../services/auth.service';

export interface UseAuthResult {
  /** The authenticated user, or null */
  user: User | null;
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
  /** Whether an auth operation is in progress */
  isLoading: boolean;
  /** The current access token */
  accessToken: string | null;
  /** Log in with a Firebase ID token */
  login: (idToken: string) => Promise<void>;
  /** Log out and clear all auth state */
  logout: () => Promise<void>;
  /** Restore session from secure storage on app launch */
  restoreSession: () => Promise<void>;
}

/**
 * Returns auth state and actions for login, logout, and session restoration.
 */
export function useAuth(): UseAuthResult {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const setLoading = useAuthStore((state) => state.setLoading);

  const login = useCallback(
    async (idToken: string) => {
      setLoading(true);
      try {
        const { accessToken: token, user: authUser } =
          await authService.verifyToken(idToken);
        await authService.saveToken(token);
        setAuth(token, authUser);
      } catch (error) {
        clearAuth();
        throw error;
      }
    },
    [setAuth, clearAuth, setLoading],
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      clearAuth();
    }
  }, [clearAuth]);

  const restoreSession = useCallback(async () => {
    setLoading(true);
    try {
      const storedToken = await authService.getStoredToken();
      if (!storedToken) {
        clearAuth();
        return;
      }
      // Temporarily set the token so the API interceptor can use it
      setAuth(storedToken, null as unknown as User);
      const { user: sessionUser } = await authService.getSession();
      setAuth(storedToken, sessionUser);
    } catch {
      await authService.removeToken();
      clearAuth();
    }
  }, [setAuth, clearAuth, setLoading]);

  return {
    user,
    isAuthenticated,
    isLoading,
    accessToken,
    login,
    logout,
    restoreSession,
  };
}
