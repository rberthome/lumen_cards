import { ref } from 'vue';

export function useAsync<T = unknown>() {
  const loading = ref(false);
  const error = ref<Error | null>(null);

  async function execute(fn: () => Promise<T>): Promise<T | undefined> {
    loading.value = true;
    error.value = null;
    try {
      return await fn();
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e));
      throw e;
    } finally {
      loading.value = false;
    }
  }

  return { loading, error, execute };
}
