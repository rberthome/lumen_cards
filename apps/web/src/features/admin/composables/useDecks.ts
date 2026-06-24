import { ref } from 'vue';
import { deckApi } from '../api/deckApi';
import type { AdminDeckDto } from '../types';

export function useDecks() {
  const decks = ref<AdminDeckDto[]>([]);
  const total = ref(0);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const page = ref(1);
  const search = ref('');
  const categoryId = ref<number | undefined>(undefined);

  async function load() {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await deckApi.list(page.value, search.value || undefined, categoryId.value);
      decks.value = data.data;
      total.value = data.total;
    } catch {
      error.value = 'errors.generic';
    } finally {
      loading.value = false;
    }
  }

  function onSearch(q: string) {
    search.value = q;
    page.value = 1;
    load();
  }

  function onCategory(id: number | undefined) {
    categoryId.value = id;
    page.value = 1;
    load();
  }

  async function create(payload: { title: string; description?: string; category_id?: number | null; cover_emoji?: string }) {
    const { data } = await deckApi.create(payload);
    decks.value.unshift(data);
    total.value++;
    return data;
  }

  async function update(id: number, payload: Partial<{ title: string; description: string; category_id: number | null; cover_emoji: string }>) {
    const { data } = await deckApi.update(id, payload);
    const idx = decks.value.findIndex((d) => d.id === id);
    if (idx !== -1) decks.value[idx] = data;
    return data;
  }

  async function togglePublish(deck: AdminDeckDto) {
    const { data } = await deckApi.publish(deck.id, !deck.is_published);
    const idx = decks.value.findIndex((d) => d.id === deck.id);
    if (idx !== -1) decks.value[idx] = data;
  }

  async function remove(id: number) {
    await deckApi.remove(id);
    decks.value = decks.value.filter((d) => d.id !== id);
    total.value = Math.max(0, total.value - 1);
  }

  return { decks, total, loading, error, page, search, categoryId, load, onSearch, onCategory, create, update, togglePublish, remove };
}
