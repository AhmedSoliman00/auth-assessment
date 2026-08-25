import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { User } from '../types/auth.types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isInitialized: boolean;

  setAuth: (user: User, accessToken: string) => void;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
  setInitialized: (initialized: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      user: null,
      accessToken: null,
      isInitialized: false,

      setAuth: (user: User, accessToken: string) =>
        set({ user, accessToken }, false, 'auth/setAuth'),

      setAccessToken: (accessToken: string) =>
        set({ accessToken }, false, 'auth/setAccessToken'),

      clearAuth: () =>
        set({ user: null, accessToken: null }, false, 'auth/clearAuth'),

      setInitialized: (isInitialized: boolean) =>
        set({ isInitialized }, false, 'auth/setInitialized'),
    }),
    { name: 'Auth Store', enabled: true },
  ),
);
