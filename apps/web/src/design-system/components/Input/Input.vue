<script setup lang="ts">
defineProps<{
  modelValue?: string;
  type?: string;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
}>();

defineEmits<{ 'update:modelValue': [value: string] }>();
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-sm font-medium text-neutral-700">{{ label }}</label>
    <input
      :type="type ?? 'text'"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="[
        'w-full rounded-lg border px-3 py-2 text-neutral-900 placeholder-neutral-400 transition-colors focus:outline-none focus:ring-2',
        error ? 'border-red-400 focus:ring-red-300' : 'border-neutral-300 focus:border-gold-400 focus:ring-gold-200',
        disabled ? 'opacity-50 cursor-not-allowed bg-neutral-50' : 'bg-white',
      ]"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
  </div>
</template>
