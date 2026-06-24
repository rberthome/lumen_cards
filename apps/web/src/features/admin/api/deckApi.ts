import { apiClient } from '@/lib/apiClient';
import type { AdminDeckDto, Paginated } from '../types';

type DeckPayload = {
  title: string;
  description?: string;
  category_id?: number | null;
  cover_emoji?: string;
};

export const deckApi = {
  list: (page = 1, search?: string, categoryId?: number) =>
    apiClient.get<Paginated<AdminDeckDto>>('/admin/decks', {
      params: { page, search: search || undefined, category_id: categoryId || undefined },
    }),

  create: (data: DeckPayload) =>
    apiClient.post<AdminDeckDto>('/admin/decks', data),

  update: (id: number, data: Partial<DeckPayload>) =>
    apiClient.put<AdminDeckDto>(`/admin/decks/${id}`, data),

  publish: (id: number, published: boolean) =>
    apiClient.patch<AdminDeckDto>(`/admin/decks/${id}/publish`, { published }),

  remove: (id: number) =>
    apiClient.delete(`/admin/decks/${id}`),
};
