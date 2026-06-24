<script setup lang="ts">
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import confetti from 'canvas-confetti';
import { Button } from '@/design-system';
import type { ReviewResultDto } from '@lumen_cards/types';

const props = defineProps<{ result: ReviewResultDto }>();
defineEmits<{ back: []; restart: [] }>();

const { t } = useI18n();

// Célébration : confetti à l'apparition, intensité selon la précision.
onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const intensity = props.result.accuracy >= 0.8 ? 160 : props.result.accuracy >= 0.5 ? 100 : 60;
  confetti({
    particleCount: intensity,
    spread: 80,
    origin: { y: 0.3 },
    colors: ['#F59E0B', '#D97706', '#6366F1', '#FCD34D'],
  });
});
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="text-center result-pop">
      <p class="text-5xl mb-4">{{ result.accuracy >= 0.8 ? '🏆' : result.accuracy >= 0.5 ? '⭐' : '💪' }}</p>
      <h2 class="text-2xl font-bold text-neutral-900">{{ t('study.session_done') }}</h2>
      <p class="mt-2 inline-flex items-center gap-2 rounded-full bg-gold-50 px-4 py-1.5 text-sm font-semibold text-gold-700">
        {{ t('study.level_label', { level: result.level }) }}
      </p>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="rounded-xl bg-gold-50 p-4 text-center">
        <p class="text-2xl font-bold text-gold-700">+{{ result.xp_earned }}</p>
        <p class="text-xs text-neutral-500 mt-1">{{ t('study.xp_earned') }}</p>
      </div>
      <div class="rounded-xl bg-green-50 p-4 text-center">
        <p class="text-2xl font-bold text-green-700">{{ Math.round(result.accuracy * 100) }}%</p>
        <p class="text-xs text-neutral-500 mt-1">{{ t('study.accuracy') }}</p>
      </div>
      <div class="rounded-xl bg-neutral-50 p-4 text-center">
        <p class="text-2xl font-bold text-neutral-700">{{ result.cards_reviewed }}</p>
        <p class="text-xs text-neutral-500 mt-1">{{ t('study.cards_reviewed') }}</p>
      </div>
      <div class="rounded-xl bg-indigo-50 p-4 text-center">
        <p class="text-2xl font-bold text-indigo-700">🔥 {{ result.streak_days }}</p>
        <p class="text-xs text-neutral-500 mt-1">{{ t('study.streak') }}</p>
      </div>
    </div>
    <div class="flex gap-3">
      <Button variant="secondary" class="flex-1" @click="$emit('back')">{{ t('study.back_to_deck') }}</Button>
      <Button class="flex-1" @click="$emit('restart')">{{ t('study.restart') }}</Button>
    </div>
  </div>
</template>

<style scoped>
.result-pop {
  animation: result-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes result-pop {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
@media (prefers-reduced-motion: reduce) {
  .result-pop { animation: none; }
}
</style>
