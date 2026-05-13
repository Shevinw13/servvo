/**
 * Auth service for handling authentication operations.
 * Manages Firebase token verification with the backend,
 * session retrieval, logout, and secure token storage.
 */

import * as SecureStore from 'expo-secure-store';
import api from './api';
import { User } from '../stores/authStore';

const TOKEN_KEY = 'servvo_access_token';

export interface VerifyTokenResponse {
  accessToken: string;
  user: User;
}

export interface SessionResponse {
  user: User;
}

/**
 * Verify a Firebase ID token with the backend.
 * Returns an access token and user profile on success.
 */
export async function verifyToken(idToken: string): Promise<VerifyTokenResponse> {
  const response = await api.post<VerifyTokenResponse>('/auth/verify-token', {
    idToken,
  });
  return response.data;
}

/**
 * Get the current session from the backend.
 * Validates the stored access token and returns the user profile.
 */
export async function getSession(): Promise<SessionResponse> {
  const response = await api.get<SessionResponse>('/auth/session');
  return response.data;
}

/**
 * Log out the current user.
 * Calls the backend logout endpoint and removes the stored token.
 */
export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } finally {
    await removeToken();
  }
}

/**
 * Save the access token to secure storage.
 */
export async function saveToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

/**
 * Retrieve the stored access token from secure storage.
 * Returns null if no token is stored.
 */
export async function getStoredToken(): Promise<string | null> {
  return await SecureStore.getItemAsync(TOKEN_KEY);
}

/**
 * Remove the stored access token from secure storage.
 */
export async function removeToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}
