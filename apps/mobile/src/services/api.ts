/**
 * Configured Axios instance with auth token interceptor.
 * Attaches Bearer token from authStore on every request.
 * On 401 responses, clears auth state to trigger re-login.
 */

import axios from 'axios';
import { useAuthStore } from '../stores/authStore';
import { getMockResponse } from './mockInterceptor';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach Bearer token
api.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: mock data fallback when backend is unavailable
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If network error (no backend running), try mock data
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED' || !error.response) {
      const mockResp = getMockResponse(error.config);
      if (mockResp) {
        return Promise.resolve(mockResp);
      }
    }
    // Handle 401 by clearing auth
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
    }
    return Promise.reject(error);
  },
);

export default api;
