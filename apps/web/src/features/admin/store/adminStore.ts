import { defineStore } from 'pinia';
import { ref } from 'vue';
import { adminApi } from '../api/adminApi';
import type { AdminUser, AdminStats } from '../types';

export const useAdminStore = defineStore('admin', () => {
  const users = ref<AdminUser[]>([]);
  const stats = ref<AdminStats | null>(null);
  const total = ref(0);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  async function fetchUsers(page = 1, search?: string) {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await adminApi.getUsers(page, search);
      users.value = data.data;
      total.value = data.total;
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e));
    } finally {
      loading.value = false;
    }
  }

  async function fetchStats() {
    const { data } = await adminApi.getStats();
    stats.value = data;
  }

  function removeUser(userId: number) {
    users.value = users.value.filter((u) => u.id !== userId);
    total.value = Math.max(0, total.value - 1);
  }

  return { users, stats, total, loading, error, fetchUsers, fetchStats, removeUser };
});
