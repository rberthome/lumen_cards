<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
}>();

defineEmits<{ click: [] }>();
</script>

<template>
  <button
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
      size === 'sm' ? 'px-3 py-1.5 text-sm' : size === 'lg' ? 'px-6 py-3 text-lg' : 'px-4 py-2 text-base',
      variant === 'secondary' ? 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 focus:ring-neutral-400' :
      variant === 'danger'    ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500' :
      variant === 'ghost'     ? 'bg-transparent text-gold-700 hover:bg-gold-50 focus:ring-gold-500' :
                                'bg-gold-500 text-neutral-900 hover:bg-gold-600 focus:ring-gold-400',
      (disabled || loading) ? 'opacity-50 cursor-not-allowed' : '',
    ]"
    @click="$emit('click')"
  >
    <span v-if="loading" class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent" />
    <slot />
  </button>
</template>
