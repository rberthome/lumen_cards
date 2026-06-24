import { apiClient } from '@/lib/apiClient';
import type { CategoryDto } from '../types';

export const categoryApi = {
  list: () =>
    apiClient.get<CategoryDto[]>('/categories'),

  create: (data: { name: string; description?: string; cover_emoji?: string; sort_order?: number }) =>
    apiClient.post<CategoryDto>('/admin/categories', data),

  update: (id: number, data: Partial<{ name: string; description: string; cover_emoji: string; sort_order: number }>) =>
    apiClient.put<CategoryDto>(`/admin/categories/${id}`, data),

  remove: (id: number) =>
    apiClient.delete(`/admin/categories/${id}`),
};
