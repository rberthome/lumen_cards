import { ref } from 'vue';
import { cardApi } from '../api/cardApi';
import type { AdminCardDto } from '../types';

type CardPayload = {
  deck_id: number;
  front: string;
  back: string;
  explanation?: string;
  wrong_answer_1?: string;
  wrong_answer_2?: string;
  wrong_answer_3?: string;
  source?: string;
  tags?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
};

export function useCards() {
  const cards = ref<AdminCardDto[]>([]);
  const total = ref(0);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const page = ref(1);
  const search = ref('');
  const deckId = ref<number | undefined>(undefined);

  async function load() {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await cardApi.list(page.value, deckId.value, search.value || undefined);
      cards.value = data.data;
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

  function onDeck(id: number | undefined) {
    deckId.value = id;
    page.value = 1;
    load();
  }

  async function create(payload: CardPayload) {
    const { data } = await cardApi.create(payload);
    cards.value.unshift(data);
    total.value++;
    return data;
  }

  async function update(id: number, payload: Partial<CardPayload>) {
    const { data } = await cardApi.update(id, payload);
    const idx = cards.value.findIndex((c) => c.id === id);
    if (idx !== -1) cards.value[idx] = data;
    return data;
  }

  async function remove(id: number) {
    await cardApi.remove(id);
    cards.value = cards.value.filter((c) => c.id !== id);
    total.value = Math.max(0, total.value - 1);
  }

  return { cards, total, loading, error, page, search, deckId, load, onSearch, onDeck, create, update, remove };
}
