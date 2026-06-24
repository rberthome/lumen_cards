import { useReviewStore } from '../../store/reviewStore';

describe('reviewStore', () => {
  beforeEach(() => {
    useReviewStore.getState().reset();
  });

  it('should start in config phase', () => {
    expect(useReviewStore.getState().phase).toBe('config');
  });

  it('should transition to front phase after startSession', () => {
    const card = {
      id: 1,
      front: 'Q',
      back: 'A',
      deck_id: 1,
      tags: [],
      difficulty: 'easy' as const,
      explanation: null,
      source: null,
      interval: 0,
      repetition: 0,
      ease_factor: 2.5,
      next_review_at: null,
      attempts: 0,
    };
    useReviewStore.getState().startSession(42, [card]);
    expect(useReviewStore.getState().phase).toBe('front');
    expect(useReviewStore.getState().sessionId).toBe(42);
  });

  it('should move to back phase on revealCard', () => {
    const card = {
      id: 1,
      front: 'Q',
      back: 'A',
      deck_id: 1,
      tags: [],
      difficulty: 'easy' as const,
      explanation: null,
      source: null,
      interval: 0,
      repetition: 0,
      ease_factor: 2.5,
      next_review_at: null,
      attempts: 0,
    };
    useReviewStore.getState().startSession(42, [card]);
    useReviewStore.getState().revealCard();
    expect(useReviewStore.getState().phase).toBe('back');
  });

  it('should requeue card and go to explanation on answerCard(false)', () => {
    const card = {
      id: 1,
      front: 'Q',
      back: 'A',
      deck_id: 1,
      tags: [],
      difficulty: 'easy' as const,
      explanation: 'Explication',
      source: null,
      interval: 0,
      repetition: 0,
      ease_factor: 2.5,
      next_review_at: null,
      attempts: 0,
    };
    useReviewStore.getState().startSession(42, [card]);
    useReviewStore.getState().revealCard();
    useReviewStore.getState().answerCard(false);
    const state = useReviewStore.getState();
    expect(state.phase).toBe('explanation');
    expect(state.queue.length).toBe(2); // card requeued
  });

  it('should log answered card and advance on answerCard(true)', () => {
    const cards = [
      {
        id: 1,
        front: 'Q1',
        back: 'A1',
        deck_id: 1,
        tags: [],
        difficulty: 'easy' as const,
        explanation: null,
        source: null,
        interval: 0,
        repetition: 0,
        ease_factor: 2.5,
        next_review_at: null,
        attempts: 0,
      },
      {
        id: 2,
        front: 'Q2',
        back: 'A2',
        deck_id: 1,
        tags: [],
        difficulty: 'easy' as const,
        explanation: null,
        source: null,
        interval: 0,
        repetition: 0,
        ease_factor: 2.5,
        next_review_at: null,
        attempts: 0,
      },
    ];
    useReviewStore.getState().startSession(42, cards);
    useReviewStore.getState().revealCard();
    useReviewStore.getState().answerCard(true);
    useReviewStore.getState().nextCard();
    expect(useReviewStore.getState().currentIndex).toBe(1);
  });

  it('should move to result phase after last card', () => {
    const card = {
      id: 1,
      front: 'Q',
      back: 'A',
      deck_id: 1,
      tags: [],
      difficulty: 'easy' as const,
      explanation: null,
      source: null,
      interval: 0,
      repetition: 0,
      ease_factor: 2.5,
      next_review_at: null,
      attempts: 0,
    };
    useReviewStore.getState().startSession(42, [card]);
    useReviewStore.getState().revealCard();
    useReviewStore.getState().answerCard(true);
    useReviewStore.getState().nextCard();
    expect(useReviewStore.getState().phase).toBe('result');
  });
});
