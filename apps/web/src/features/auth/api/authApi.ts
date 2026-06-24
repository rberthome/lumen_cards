import { apiClient } from '@/lib/apiClient';
import type { AuthUser } from '../store/authStore';

type AuthResponse = { token: string; user: AuthUser };

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<AuthResponse>('/auth/login', { email, password }),

  register: (name: string, email: string, password: string, password_confirmation: string) =>
    apiClient.post<AuthResponse>('/auth/register', { name, email, password, password_confirmation }),

  logout: () => apiClient.post('/auth/logout'),

  me: () => apiClient.get<{ data: AuthUser }>('/user'),
};
