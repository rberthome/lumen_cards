<script setup lang="ts">
import { useToastStore } from '@/stores/toast';
const toast = useToastStore();
</script>

<template>
  <Teleport to="body">
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <TransitionGroup name="toast">
        <div
          v-for="t in toast.items"
          :key="t.id"
          :class="[
            'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium shadow-lg',
            t.type === 'error'   ? 'bg-red-600 text-white' :
            t.type === 'success' ? 'bg-green-600 text-white' :
            t.type === 'warning' ? 'bg-gold-500 text-white' :
                                   'bg-neutral-900 text-white',
          ]"
        >
          {{ t.message }}
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s; }
.toast-enter-from { opacity: 0; transform: translateX(1rem); }
.toast-leave-to { opacity: 0; transform: translateX(1rem); }
</style>
