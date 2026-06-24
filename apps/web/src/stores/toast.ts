import { defineStore } from 'pinia';
import { ref } from 'vue';

interface ToastItem {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export const useToastStore = defineStore('toast', () => {
  const items = ref<ToastItem[]>([]);
  let _id = 0;

  function show(message: string, type: ToastItem['type'] = 'info', duration = 4000) {
    const id = ++_id;
    items.value.push({ id, message, type });
    setTimeout(() => { items.value = items.value.filter((t) => t.id !== id); }, duration);
  }

  return {
    items,
    success: (msg: string) => show(msg, 'success'),
    error: (msg: string) => show(msg, 'error'),
    warning: (msg: string) => show(msg, 'warning'),
    info: (msg: string) => show(msg, 'info'),
  };
});
