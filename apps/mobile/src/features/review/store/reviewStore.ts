import { create } from 'zustand';
import type { ReviewSessionCard, SessionProgress, SessionSize } from '../types';
import type { ReviewResultDto } from '@lumen_cards/types';

export type ReviewPhase = 'config' | 'front' | 'back' | 'explanation' | 'result';

interface ReviewState {
  deckId: number | null;
  sessionId: number | null;
  sessionSize: SessionSize;
  phase: ReviewPhase;
  queue: ReviewSessionCard[];
  currentIndex: number;
  cardStartTime: number;
  reviewLog: { card_id: number; knew: boolean; time_spent_ms: number }[];
  result: ReviewResultDto | null;

  setDeck: (deckId: number) => void;
  setSessionSize: (size: SessionSize) => void;
  startSession: (sessionId: number, cards: ReviewSessionCard[]) => void;
  revealCard: () => void;
  answerCard: (knew: boolean) => ReviewSessionCard | null;
  showExplanation: () => void;
  nextCard: () => void;
  setResult: (result: ReviewResultDto) => void;
  reset: () => void;
  getProgress: () => SessionProgress;
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  deckId: null,
  sessionId: null,
  sessionSize: 20,
  phase: 'config',
  queue: [],
  currentIndex: 0,
  cardStartTime: 0,
  reviewLog: [],
  result: null,

  setDeck: (deckId) => set({ deckId }),
  setSessionSize: (size) => set({ sessionSize: size }),

  startSession: (sessionId, cards) =>
    set({
      sessionId,
      phase: 'front',
      queue: cards,
      currentIndex: 0,
      cardStartTime: Date.now(),
      reviewLog: [],
      result: null,
    }),

  revealCard: () => set({ phase: 'back' }),

  answerCard: (knew) => {
    const { queue, currentIndex, cardStartTime, reviewLog } = get();
    const card = queue[currentIndex];
    if (!card) return null;

    const elapsed = Date.now() - cardStartTime;
    const newLog = [...reviewLog, { card_id: card.id, knew, time_spent_ms: elapsed }];

    if (!knew) {
      // Requeue card at the end with incremented attempts
      const requeued = [...queue, { ...card, attempts: (card.attempts ?? 0) + 1 }];
      set({ reviewLog: newLog, queue: requeued, phase: 'explanation' });
      return card;
    }

    set({ reviewLog: newLog, phase: 'back' });
    return card;
  },

  showExplanation: () => set({ phase: 'explanation' }),

  nextCard: () => {
    const { currentIndex, queue } = get();
    const isLast = currentIndex >= queue.length - 1;
    if (isLast) {
      set({ phase: 'result' });
    } else {
      set({ currentIndex: currentIndex + 1, phase: 'front', cardStartTime: Date.now() });
    }
  },

  setResult: (result) => set({ result }),

  reset: () =>
    set({
      deckId: null,
      sessionId: null,
      sessionSize: 20,
      phase: 'config',
      queue: [],
      currentIndex: 0,
      cardStartTime: 0,
      reviewLog: [],
      result: null,
    }),

  getProgress: () => {
    const { currentIndex, queue, reviewLog } = get();
    const correct = reviewLog.filter((r) => r.knew).length;
    return {
      total: queue.length,
      current: currentIndex + 1,
      correct,
      incorrect: reviewLog.length - correct,
    };
  },
}));
