import { apiClient } from '@/lib/apiClient';
import type { AdminCardDto, Paginated } from '../types';

type CardPayload = {
  deck_id: number;
  front: string;
  back: string;
  explanation?: string;
  wrong_answer_1?: string;
  wrong_answer_2?: string;
  wrong_answer_3?: string;
  source?: string;
  tags?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
};

export const cardApi = {
  list: (page = 1, deckId?: number, search?: string) =>
    apiClient.get<Paginated<AdminCardDto>>('/admin/cards', {
      params: { page, deck_id: deckId || undefined, search: search || undefined },
    }),

  create: (data: CardPayload) =>
    apiClient.post<AdminCardDto>('/admin/cards', data),

  update: (id: number, data: Partial<CardPayload>) =>
    apiClient.put<AdminCardDto>(`/admin/cards/${id}`, data),

  remove: (id: number) =>
    apiClient.delete(`/admin/cards/${id}`),
};
