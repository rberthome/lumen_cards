import { ref, onMounted } from 'vue';
import { studyApi } from '../api/studyApi';
import type { UserStatDto } from '@lumen_cards/types';

export function useStats() {
  const stats = ref<UserStatDto | null>(null);
  const loading = ref(false);

  async function load() {
    loading.value = true;
    try {
      const { data } = await studyApi.getStats();
      stats.value = data.data;
    } finally {
      loading.value = false;
    }
  }

  onMounted(load);

  return { stats, loading };
}
