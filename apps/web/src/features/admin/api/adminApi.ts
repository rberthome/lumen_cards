import { apiClient } from '@/lib/apiClient';
import type { AdminUser, AdminStats } from '../types';

export const adminApi = {
  getUsers: (page = 1, search?: string) =>
    apiClient.get<{ data: AdminUser[]; total: number; per_page: number }>('/admin/users', {
      params: { page, search },
    }),

  deleteUser: (userId: number) =>
    apiClient.delete(`/admin/users/${userId}`),

  exportUserData: (userId: number) =>
    apiClient.get(`/admin/users/${userId}/export`, { responseType: 'blob' }).then((r) => r.data as Blob),

  getStats: () =>
    apiClient.get<AdminStats>('/admin/stats'),
};
