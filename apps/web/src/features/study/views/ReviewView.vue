<script setup lang="ts">
import { watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Button } from '@/design-system';
import ReviewProgress from '../components/ReviewProgress.vue';
import { useReview } from '../composables/useReview';

const props = defineProps<{ deckId: string }>();
const { t } = useI18n();
const { store, loadingSession, submitting, error, startSession, submitAndFinish, goBack } = useReview(Number(props.deckId));

const SIZES = [5, 10, 20, 'all'] as const;

onMounted(() => { store.reset(); });

watch(() => store.phase, async (phase) => {
  if (phase === 'result' && !store.result && !submitting.value) {
    await submitAndFinish();
  }
});

async function pickChoice(choice: string) {
  if (store.selectedChoice !== null) return;
  const knew = store.selectChoice(choice);
  await new Promise<void>((r) => setTimeout(r, 650));
  store.answerCard(knew);
}

function choiceClass(choice: string): string {
  const card = store.currentCard;
  if (!card) return '';
  const selected = store.selectedChoice;
  const isCorrect = choice === card.back;

  if (selected === null) {
    return 'border-neutral-200 bg-white text-neutral-700 hover:border-gold-300 hover:bg-gold-50 cursor-pointer';
  }
  if (isCorrect) {
    return 'border-green-400 bg-green-50 text-green-800';
  }
  if (selected === choice) {
    return 'border-red-400 bg-red-50 text-red-800';
  }
  return 'border-neutral-100 bg-neutral-50 text-neutral-300';
}
</script>

<template>
  <div class="mx-auto max-w-xl flex flex-col gap-6 py-4">

    <!-- CONFIG -->
    <template v-if="store.phase === 'config'">
      <div class="text-center">
        <h1 class="text-2xl font-bold text-neutral-900 mb-2">{{ t('study.start_session') }}</h1>
        <p class="text-neutral-500 text-sm">{{ t('study.choose_size') }}</p>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <button
          v-for="s in SIZES"
          :key="s"
          :class="[
            'rounded-xl border-2 py-4 text-center font-medium transition-colors',
            store.sessionSize === s
              ? 'border-gold-400 bg-gold-50 text-gold-700'
              : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300',
          ]"
          @click="store.sessionSize = s"
        >
          {{ s === 'all' ? t('study.size_all') : s + ' ' + t('study.cards') }}
        </button>
      </div>
      <p v-if="error" class="text-sm text-red-600 text-center">{{ t(error) }}</p>
      <Button :loading="loadingSession" @click="startSession">{{ t('study.start') }}</Button>
      <button class="text-sm text-neutral-400 hover:text-neutral-600 text-center" @click="goBack">{{ t('common.back') }}</button>
    </template>

    <!-- CARD FRONT -->
    <template v-else-if="store.phase === 'front' && store.currentCard">
      <ReviewProgress v-bind="store.progress" />

      <!-- QCM mode -->
      <template v-if="store.currentCard.show_choices">
        <div class="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm text-center min-h-36 flex items-center justify-center">
          <p class="text-xl font-medium text-neutral-900 leading-relaxed">{{ store.currentCard.front }}</p>
        </div>
        <div class="flex flex-col gap-3">
          <button
            v-for="choice in store.shuffledChoices"
            :key="choice"
            :disabled="store.selectedChoice !== null"
            :class="[
              'rounded-xl border-2 py-4 px-5 text-left font-medium transition-all duration-300',
              choiceClass(choice),
            ]"
            @click="pickChoice(choice)"
          >
            {{ choice }}
          </button>
        </div>
      </template>

      <!-- Classic mode -->
      <template v-else>
        <div class="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm text-center min-h-48 flex items-center justify-center">
          <p class="text-xl font-medium text-neutral-900 leading-relaxed">{{ store.currentCard.front }}</p>
        </div>
        <Button @click="store.revealCard()">{{ t('study.reveal') }}</Button>
      </template>
    </template>

    <!-- CARD BACK (classic only) -->
    <template v-else-if="store.phase === 'back' && store.currentCard">
      <ReviewProgress v-bind="store.progress" />
      <div class="flex flex-col gap-3">
        <div class="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <p class="text-base text-neutral-500 mb-3 pb-3 border-b border-neutral-100">{{ store.currentCard.front }}</p>
          <p class="text-lg font-medium text-neutral-900 leading-relaxed">{{ store.currentCard.back }}</p>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <Button variant="danger" @click="store.answerCard(false)">{{ t('study.didnt_know') }}</Button>
        <Button @click="store.answerCard(true)">{{ t('study.knew') }}</Button>
      </div>
    </template>

    <!-- EXPLANATION -->
    <template v-else-if="store.phase === 'explanation' && store.currentCard">
      <ReviewProgress v-bind="store.progress" />
      <div class="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <p class="text-base font-medium text-neutral-900 mb-2">{{ store.currentCard.front }}</p>
        <p class="text-sm text-neutral-600 mb-4 pb-4 border-b border-neutral-100">{{ store.currentCard.back }}</p>
        <div v-if="store.currentCard.explanation" class="rounded-xl bg-indigo-50 p-4">
          <p class="text-xs font-semibold text-indigo-600 mb-1 uppercase tracking-wide">{{ t('study.explanation') }}</p>
          <p class="text-sm text-indigo-900 leading-relaxed">{{ store.currentCard.explanation }}</p>
        </div>
      </div>
      <Button @click="store.nextCard()">{{ t('study.next') }}</Button>
    </template>

    <!-- RESULT -->
    <template v-else-if="store.phase === 'result'">
      <div v-if="submitting || !store.result" class="flex items-center justify-center py-20">
        <div class="h-8 w-8 animate-spin rounded-full border-2 border-gold-400 border-t-transparent" />
      </div>
      <template v-else>
        <div class="text-center">
          <p class="text-5xl mb-4">{{ store.result.accuracy >= 0.8 ? '🏆' : store.result.accuracy >= 0.5 ? '⭐' : '💪' }}</p>
          <h2 class="text-2xl font-bold text-neutral-900">{{ t('study.session_done') }}</h2>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div class="rounded-xl bg-gold-50 p-4 text-center">
            <p class="text-2xl font-bold text-gold-700">+{{ store.result.xp_earned }}</p>
            <p class="text-xs text-neutral-500 mt-1">XP gagnés</p>
          </div>
          <div class="rounded-xl bg-green-50 p-4 text-center">
            <p class="text-2xl font-bold text-green-700">{{ Math.round(store.result.accuracy * 100) }}%</p>
            <p class="text-xs text-neutral-500 mt-1">{{ t('study.accuracy') }}</p>
          </div>
          <div class="rounded-xl bg-neutral-50 p-4 text-center">
            <p class="text-2xl font-bold text-neutral-700">{{ store.result.cards_reviewed }}</p>
            <p class="text-xs text-neutral-500 mt-1">{{ t('study.cards_reviewed') }}</p>
          </div>
          <div class="rounded-xl bg-indigo-50 p-4 text-center">
            <p class="text-2xl font-bold text-indigo-700">{{ store.result.streak_days }}</p>
            <p class="text-xs text-neutral-500 mt-1">{{ t('study.streak') }}</p>
          </div>
        </div>
        <div class="flex gap-3">
          <Button variant="secondary" class="flex-1" @click="goBack">{{ t('study.back_to_deck') }}</Button>
          <Button class="flex-1" @click="store.reset(); startSession()">{{ t('study.restart') }}</Button>
        </div>
      </template>
    </template>

  </div>
</template>
