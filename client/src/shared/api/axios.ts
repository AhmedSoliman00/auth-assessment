import axios, { type AxiosError } from 'axios';
import { useAuthStore } from '../../features/auth/store/auth.store';
import { refreshAccessToken } from './refresh';

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

// Attach Authorization header if access token exists in memory
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const AUTH_ENDPOINTS = [
  '/auth/signin',
  '/auth/signup',
  '/auth/refresh',
  '/auth/logout',
];

const isAuthEndpoint = (url?: string): boolean =>
  AUTH_ENDPOINTS.some((endpoint) => url?.includes(endpoint));

// Single-flight refresh promise shared across simultaneous 401s
let refreshPromise: Promise<string> | null = null;

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config;

    if (!config || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Exclude auth endpoints from triggering refresh logic
    if (isAuthEndpoint(config.url) || config._retry) {
      return Promise.reject(error);
    }

    config._retry = true;

    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
    }

    try {
      const newToken = await refreshPromise;
      config.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(config);
    } catch (refreshError) {
      useAuthStore.getState().clearAuth();
      return Promise.reject(refreshError);
    }
  },
);
