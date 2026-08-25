import { useEffect, type ReactNode } from 'react';
import { useAuthStore } from '../store/auth.store';
import { refreshAccessToken } from '../../../shared/api/refresh';
import { authApi } from '../api/auth.api';

interface AuthInitializerProps {
  children: ReactNode;
}

export function AuthInitializer({ children }: AuthInitializerProps) {
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const setInitialized = useAuthStore((state) => state.setInitialized);

  useEffect(() => {
    let isMounted = true;

    async function initializeSession() {
      try {
        // Attempt to rotate refresh token cookie to get a fresh access token
        const accessToken = await refreshAccessToken();
        if (!isMounted) return;

        // Fetch current user profile using the new access token
        const user = await authApi.getMe();
        if (!isMounted) return;

        setAuth(user, accessToken);
      } catch {
        if (isMounted) {
          clearAuth();
        }
      } finally {
        if (isMounted) {
          setInitialized(true);
        }
      }
    }

    initializeSession();

    return () => {
      isMounted = false;
    };
  }, [setAuth, clearAuth, setInitialized]);

  return <>{children}</>;
}
