import { useCallback } from 'react';
import { useReviewStore } from '../store/reviewStore';
import { useReviewSession as useSessionQuery, useSubmitReview } from '../api/reviewApi';
import type { ReviewSessionCard } from '../types';

export function useReviewSession(deckId: number) {
  const store = useReviewStore();
  const { mutateAsync: submit, isPending: isSubmitting } = useSubmitReview();

  const {
    data: session,
    isLoading,
    error,
    refetch,
  } = useSessionQuery(deckId, store.sessionSize, store.phase === 'config');

  const startSession = useCallback(() => {
    if (!session) return;
    const cards: ReviewSessionCard[] = session.cards.map((c) => ({ ...c, attempts: 0 }));
    store.startSession(session.id, cards);
  }, [session, store]);

  const answer = useCallback(
    (knew: boolean) => {
      store.answerCard(knew);
      if (knew) {
        store.nextCard();
      }
    },
    [store]
  );

  const continueAfterExplanation = useCallback(() => {
    store.nextCard();
  }, [store]);

  const finishSession = useCallback(async () => {
    if (!store.sessionId) return;
    const result = await submit({
      session_id: store.sessionId,
      items: store.reviewLog,
    });
    store.setResult(result);
  }, [store, submit]);

  const currentCard = store.queue[store.currentIndex] ?? null;

  return {
    phase: store.phase,
    currentCard,
    progress: store.getProgress(),
    sessionSize: store.sessionSize,
    setSessionSize: store.setSessionSize,
    result: store.result,
    isLoading,
    isSubmitting,
    error,
    startSession,
    revealCard: store.revealCard,
    answer,
    continueAfterExplanation,
    finishSession,
    reset: store.reset,
    refetch,
  };
}
