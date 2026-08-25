import axios from 'axios';
import { useAuthStore } from '../../features/auth/store/auth.store';
import type { AuthResponse } from '../../features/auth/types/auth.types';

// Bare Axios instance with no interceptors attached
const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

export async function refreshAccessToken(): Promise<string> {
  const { data } = await refreshClient.post<AuthResponse>('/auth/refresh');
  useAuthStore.getState().setAccessToken(data.accessToken);
  return data.accessToken;
}
