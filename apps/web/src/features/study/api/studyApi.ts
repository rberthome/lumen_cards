import { apiClient } from '@/lib/apiClient';
import type { DeckDto, ReviewSessionDto, ReviewResultDto, UserStatDto } from '@lumen_cards/types';

export const studyApi = {
  listDecks: () =>
    apiClient.get<{ data: DeckDto[] }>('/decks'),

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
