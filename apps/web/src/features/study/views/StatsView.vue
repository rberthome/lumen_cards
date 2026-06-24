<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import LevelBadge from '../components/LevelBadge.vue';
import { useStats } from '../composables/useStats';

const { t } = useI18n();
const { stats, loading } = useStats();

function formatTime(ms: number) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <h1 class="text-2xl font-bold text-neutral-900">{{ t('study.my_stats') }}</h1>

    <div v-if="loading" class="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <div v-for="i in 6" :key="i" class="h-24 rounded-2xl bg-neutral-100 animate-pulse" />
    </div>

    <template v-else-if="stats">
      <div class="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <LevelBadge :level="stats.level" :xp="stats.xp" :xp-to-next="stats.xp_to_next_level" />
      </div>

      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div class="rounded-xl bg-gold-50 p-4 text-center">
          <p class="text-2xl font-bold text-gold-700">{{ stats.streak_days }}</p>
          <p class="text-xs text-neutral-500 mt-1">{{ t('study.streak') }}</p>
        </div>
        <div class="rounded-xl bg-green-50 p-4 text-center">
          <p class="text-2xl font-bold text-green-700">{{ Math.round(stats.accuracy * 100) }}%</p>
          <p class="text-xs text-neutral-500 mt-1">{{ t('study.accuracy') }}</p>
        </div>
        <div class="rounded-xl bg-neutral-50 p-4 text-center">
          <p class="text-2xl font-bold text-neutral-700">{{ stats.total_cards }}</p>
          <p class="text-xs text-neutral-500 mt-1">{{ t('study.cards_seen') }}</p>
        </div>
        <div class="rounded-xl bg-indigo-50 p-4 text-center">
          <p class="text-2xl font-bold text-indigo-700">{{ stats.mastered }}</p>
          <p class="text-xs text-neutral-500 mt-1">{{ t('study.mastered') }}</p>
        </div>
        <div class="rounded-xl bg-neutral-50 p-4 text-center">
          <p class="text-2xl font-bold text-neutral-700">{{ stats.in_progress }}</p>
          <p class="text-xs text-neutral-500 mt-1">{{ t('study.in_progress') }}</p>
        </div>
        <div class="rounded-xl bg-neutral-50 p-4 text-center">
          <p class="text-2xl font-bold text-neutral-700">{{ formatTime(stats.total_time_ms) }}</p>
          <p class="text-xs text-neutral-500 mt-1">{{ t('study.total_time') }}</p>
        </div>
      </div>
    </template>
  </div>
</template>
