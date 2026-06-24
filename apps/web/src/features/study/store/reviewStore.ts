import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { CardWithProgressDto, ReviewResultDto } from '@lumen_cards/types';

export type ReviewPhase = 'config' | 'front' | 'back' | 'explanation' | 'result';
export type SessionSize = 5 | 10 | 20 | 'all';

interface ReviewCard extends CardWithProgressDto { attempts: number }

export const useReviewStore = defineStore('review', () => {
  const sessionId = ref<number | null>(null);
  const sessionSize = ref<SessionSize>(20);
  const phase = ref<ReviewPhase>('config');
  const queue = ref<ReviewCard[]>([]);
  const currentIndex = ref(0);
  const cardStartTime = ref(0);
  const reviewLog = ref<{ card_id: number; knew: boolean; time_spent_ms: number }[]>([]);
  const result = ref<ReviewResultDto | null>(null);

  const currentCard = computed(() => queue.value[currentIndex.value] ?? null);
  const progress = computed(() => ({
    total: queue.value.length,
    current: currentIndex.value + 1,
    correct: reviewLog.value.filter((r) => r.knew).length,
    incorrect: reviewLog.value.filter((r) => !r.knew).length,
  }));

  function startSession(id: number, cards: CardWithProgressDto[]) {
    sessionId.value = id;
    phase.value = 'front';
    queue.value = cards.map((c) => ({ ...c, attempts: 0 }));
    currentIndex.value = 0;
    cardStartTime.value = Date.now();
    reviewLog.value = [];
    result.value = null;
  }

  function revealCard() { phase.value = 'back'; }

  function answerCard(knew: boolean) {
    const card = queue.value[currentIndex.value];
    if (!card) return;
    const elapsed = Date.now() - cardStartTime.value;
    reviewLog.value.push({ card_id: card.id, knew, time_spent_ms: elapsed });

    if (!knew) {
      queue.value.push({ ...card, attempts: (card.attempts ?? 0) + 1 });
      phase.value = card.explanation ? 'explanation' : 'front';
    } else {
      phase.value = card.explanation ? 'explanation' : 'front';
    }
  }

  function nextCard() {
    const isLast = currentIndex.value >= queue.value.length - 1;
    if (isLast) {
      phase.value = 'result';
    } else {
      currentIndex.value++;
      phase.value = 'front';
      cardStartTime.value = Date.now();
    }
  }

  function setResult(r: ReviewResultDto) { result.value = r; }

  function reset() {
    sessionId.value = null;
    sessionSize.value = 20;
    phase.value = 'config';
    queue.value = [];
    currentIndex.value = 0;
    cardStartTime.value = 0;
    reviewLog.value = [];
    result.value = null;
  }

  return {
    sessionId, sessionSize, phase, queue, currentIndex, reviewLog, result,
    currentCard, progress,
    startSession, revealCard, answerCard, nextCard, setResult, reset,
  };
});
