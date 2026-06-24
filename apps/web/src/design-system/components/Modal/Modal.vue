<script setup lang="ts">
defineProps<{ open: boolean; title?: string }>();
defineEmits<{ close: [] }>();
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" @click="$emit('close')" />
        <div class="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
          <div v-if="title" class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-neutral-900">{{ title }}</h2>
            <button class="text-neutral-400 hover:text-neutral-600" @click="$emit('close')">✕</button>
          </div>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
