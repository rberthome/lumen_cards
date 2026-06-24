import { useQuery, useMutation } from '@tanstack/react-query';
import type { ReviewResultDto, ReviewSessionDto } from '@lumen_cards/types';
import { apiClient } from '@/lib/apiClient';
import type { SessionSize } from '../types';

export function useReviewSession(deckId: number, limit: SessionSize, enabled = true) {
  return useQuery({
    queryKey: ['review-session', deckId, limit],
    queryFn: () => {
      const params = limit === 'all' ? '' : `?limit=${limit}`;
      return apiClient.get<ReviewSessionDto>(`/decks/${deckId}/session${params}`);
    },
    enabled,
    staleTime: 0,
    gcTime: 0,
  });
}

export function useSubmitReview() {
  return useMutation({
    mutationFn: (payload: {
      items: { card_id: number; knew: boolean; time_spent_ms: number }[];
      session_id: number;
    }) => apiClient.post<ReviewResultDto>('/review/submit', payload),
  });
}
