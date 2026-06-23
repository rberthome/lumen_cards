import { apiClient } from '@/lib/apiClient';

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<{ token: string; user: { id: number; name: string; role: string } }>(
      '/auth/login', { email, password },
    ),
  logout: () => apiClient.post('/auth/logout'),
  me: () => apiClient.get<{ id: number; name: string; email: string; role: string }>('/user'),
};
