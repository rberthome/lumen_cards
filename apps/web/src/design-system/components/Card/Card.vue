<script setup lang="ts">
defineProps<{ class?: string }>();
</script>

<template>
  <div :class="['bg-white rounded-xl border border-neutral-200 shadow-sm p-6', $props.class]">
    <slot />
  </div>
</template>
