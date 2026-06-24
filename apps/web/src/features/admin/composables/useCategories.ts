import { ref } from 'vue';
import { categoryApi } from '../api/categoryApi';
import type { CategoryDto } from '../types';

export function useCategories() {
  const categories = ref<CategoryDto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function load() {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await categoryApi.list();
      categories.value = data;
    } catch {
      error.value = 'errors.generic';
    } finally {
      loading.value = false;
    }
  }

  async function create(payload: { name: string; description?: string; cover_emoji?: string; sort_order?: number }) {
    const { data } = await categoryApi.create(payload);
    categories.value.push(data);
    return data;
  }

  async function update(id: number, payload: Partial<{ name: string; description: string; cover_emoji: string; sort_order: number }>) {
    const { data } = await categoryApi.update(id, payload);
    const idx = categories.value.findIndex((c) => c.id === id);
    if (idx !== -1) categories.value[idx] = data;
    return data;
  }

  async function remove(id: number) {
    await categoryApi.remove(id);
    categories.value = categories.value.filter((c) => c.id !== id);
  }

  return { categories, loading, error, load, create, update, remove };
}
