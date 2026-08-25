import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { authApi } from '../api/auth.api';
import { getErrorMessage } from '../../../shared/lib/get-error-message';
import type { SigninFormData } from '../schemas/signin.schema';
import type { SignupFormData } from '../schemas/signup.schema';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  const isAuthenticated = Boolean(user && accessToken);

  const handleSignin = async (data: SigninFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.signIn(data);
      setAccessToken(response.accessToken);

      const userProfile = await authApi.getMe();
      setAuth(userProfile, response.accessToken);

      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (data: SignupFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.signUp(data);
      setAccessToken(response.accessToken);

      const userProfile = await authApi.getMe();
      setAuth(userProfile, response.accessToken);

      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
    } catch {
      // Ignore API errors on logout to ensure client auth state is always cleared
    } finally {
      clearAuth();
      setIsLoading(false);
      navigate('/signin', { replace: true });
    }
  };

  return {
    user,
    isAuthenticated,
    isInitialized,
    isLoading,
    error,
    setError,
    handleSignin,
    handleSignup,
    handleLogout,
  };
}
