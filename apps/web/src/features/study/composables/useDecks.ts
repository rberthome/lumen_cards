import { ref, onMounted } from 'vue';
import { studyApi } from '../api/studyApi';
import type { DeckDto } from '@lumen_cards/types';

export function useDecks() {
  const decks = ref<DeckDto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function load() {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await studyApi.listDecks();
      decks.value = data.data;
    } catch {
      error.value = 'errors.generic';
    } finally {
      loading.value = false;
    }
  }

  onMounted(load);

  return { decks, loading, error, reload: load };
}

export function useDeck(id: number) {
  const deck = ref<DeckDto | null>(null);
  const loading = ref(false);

  async function load() {
    loading.value = true;
    try {
      const { data } = await studyApi.getDeck(id);
      deck.value = data.data;
    } finally {
      loading.value = false;
    }
  }

  onMounted(load);

  return { deck, loading };
}
