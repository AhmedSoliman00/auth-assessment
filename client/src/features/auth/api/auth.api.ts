import { apiClient } from '../../../shared/api/axios';
import type { AuthResponse, User } from '../types/auth.types';
import type { SignupFormData } from '../schemas/signup.schema';
import type { SigninFormData } from '../schemas/signin.schema';

export const authApi = {
  signUp: async (data: SignupFormData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/signup', data);
    return response.data;
  },

  signIn: async (data: SigninFormData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/signin', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  getMe: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },
};
