<script setup lang="ts">
defineProps<{ variant?: 'gold' | 'indigo' | 'success' | 'error' | 'neutral' }>();
</script>

<template>
  <span :class="[
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
    variant === 'indigo'  ? 'bg-indigo-100 text-indigo-700' :
    variant === 'success' ? 'bg-green-100 text-green-700' :
    variant === 'error'   ? 'bg-red-100 text-red-700' :
    variant === 'neutral' ? 'bg-neutral-100 text-neutral-700' :
                            'bg-gold-100 text-gold-700',
  ]">
    <slot />
  </span>
</template>
