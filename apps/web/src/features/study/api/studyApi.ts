import { apiClient } from '@/lib/apiClient';
import type { CategoryDto, DeckDto, ReviewSessionDto, ReviewResultDto, UserStatDto } from '@lumen_cards/types';

export const studyApi = {
  listDecks: (categoryId?: number) =>
    apiClient.get<{ data: DeckDto[] }>('/decks', {
      params: categoryId ? { category_id: categoryId } : undefined,
    }),

  listCategories: () =>
    apiClient.get<{ data: CategoryDto[] }>('/categories'),

  getDeck: (id: number) =>
    apiClient.get<{ data: DeckDto }>(`/decks/${id}`),

  getSession: (deckId: number, limit?: number) =>
    apiClient.get<ReviewSessionDto>(`/decks/${deckId}/session`, {
      params: limit ? { limit } : undefined,
    }),

  submitReview: (payload: {
    session_id: number;
    items: { card_id: number; knew: boolean; time_spent_ms: number }[];
    total_duration_ms: number;
  }) =>
    apiClient.post<ReviewResultDto>('/review/submit', payload),

  getStats: () =>
    apiClient.get<{ data: UserStatDto }>('/stats'),
};
