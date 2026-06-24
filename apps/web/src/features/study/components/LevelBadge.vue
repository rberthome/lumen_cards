<script setup lang="ts">
import type { UserLevel } from '@lumen_cards/types';

defineProps<{ level: UserLevel; xp: number; xpToNext: number }>();

const labels: Record<UserLevel, string> = {
  apprentice: 'Apprenti',
  companion: 'Compagnon',
  master: 'Maître',
  grand_master: 'Grand Maître',
};
</script>

<template>
  <div class="flex flex-col gap-1">
    <div class="flex items-center justify-between text-sm">
      <span class="font-semibold text-gold-700">{{ labels[level] }}</span>
      <span class="text-neutral-500">{{ xp }} XP</span>
    </div>
    <div class="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
      <div
        class="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-600 transition-all duration-500"
        :style="{ width: xpToNext > 0 ? `${Math.min(100, Math.round((xp / (xp + xpToNext)) * 100))}%` : '100%' }"
      />
    </div>
    <p v-if="xpToNext > 0" class="text-right text-xs text-neutral-400">{{ xpToNext }} XP pour le prochain niveau</p>
  </div>
</template>
