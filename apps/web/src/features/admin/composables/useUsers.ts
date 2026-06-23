import { ref } from 'vue';
import { useAdminStore } from '../store/adminStore';

export function useUsers() {
  const store = useAdminStore();
  const page = ref(1);
  const search = ref('');

  async function load() {
    await store.fetchUsers(page.value, search.value || undefined);
  }

  function onSearch(q: string) {
    search.value = q;
    page.value = 1;
    load();
  }

  function onPage(p: number) {
    page.value = p;
    load();
  }

  return { users: store.users, total: store.total, loading: store.loading, page, search, load, onSearch, onPage };
}
