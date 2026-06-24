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
  const sessionStartTime = ref(0);
  const cardStartTime = ref(0);
  const reviewLog = ref<{ card_id: number; knew: boolean; time_spent_ms: number }[]>([]);
  const result = ref<ReviewResultDto | null>(null);
  const shuffledChoices = ref<string[]>([]);
  const selectedChoice = ref<string | null>(null);

  const currentCard = computed(() => queue.value[currentIndex.value] ?? null);
  const progress = computed(() => ({
    total: queue.value.length,
    current: currentIndex.value + 1,
    correct: reviewLog.value.filter((r) => r.knew).length,
    incorrect: reviewLog.value.filter((r) => !r.knew).length,
  }));

  function _buildChoices(card: ReviewCard) {
    if (!card.show_choices) { shuffledChoices.value = []; return; }
    const opts = [card.back, card.wrong_answer_1, card.wrong_answer_2, card.wrong_answer_3]
      .filter((c): c is string => c !== null && c !== undefined);
    shuffledChoices.value = opts.sort(() => Math.random() - 0.5);
  }

  function startSession(id: number, cards: CardWithProgressDto[]) {
    sessionId.value = id;
    phase.value = 'front';
    queue.value = cards.map((c) => ({ ...c, attempts: 0 }));
    currentIndex.value = 0;
    sessionStartTime.value = Date.now();
    cardStartTime.value = Date.now();
    reviewLog.value = [];
    result.value = null;
    selectedChoice.value = null;
    _buildChoices(queue.value[0]);
  }

  function revealCard() { phase.value = 'back'; }

  function selectChoice(choice: string): boolean {
    selectedChoice.value = choice;
    return choice === currentCard.value?.back;
  }

  function answerCard(knew: boolean) {
    const card = queue.value[currentIndex.value];
    if (!card) return;
    const elapsed = Date.now() - cardStartTime.value;
    reviewLog.value.push({ card_id: card.id, knew, time_spent_ms: elapsed });
    selectedChoice.value = null;

    if (!knew) {
      queue.value.push({ ...card, attempts: (card.attempts ?? 0) + 1 });
    }

    if (card.explanation) {
      phase.value = 'explanation';
    } else {
      nextCard();
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
      _buildChoices(queue.value[currentIndex.value]);
    }
  }

  function setResult(r: ReviewResultDto) { result.value = r; }

  function reset() {
    sessionId.value = null;
    sessionSize.value = 20;
    phase.value = 'config';
    queue.value = [];
    currentIndex.value = 0;
    sessionStartTime.value = 0;
    cardStartTime.value = 0;
    reviewLog.value = [];
    result.value = null;
    shuffledChoices.value = [];
    selectedChoice.value = null;
  }

  return {
    sessionId, sessionSize, phase, queue, currentIndex, sessionStartTime,
    reviewLog, result, shuffledChoices, selectedChoice,
    currentCard, progress,
    startSession, revealCard, selectChoice, answerCard, nextCard, setResult, reset,
  };
});
