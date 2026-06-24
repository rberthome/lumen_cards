<script setup lang="ts">
defineProps<{ current: number; total: number; correct: number; incorrect: number }>();
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center justify-between text-sm text-neutral-500">
      <span>{{ current }} / {{ total }}</span>
      <div class="flex gap-3">
        <span class="text-green-600">✓ {{ correct }}</span>
        <span class="text-red-500">✗ {{ incorrect }}</span>
      </div>
    </div>
    <div class="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
      <div
        class="h-full rounded-full bg-gold-400 transition-all duration-300"
        :style="{ width: `${Math.round((current / total) * 100)}%` }"
      />
    </div>
  </div>
</template>
