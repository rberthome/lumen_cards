import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authApi } from '../api/authApi';

interface AuthUser { id: number; name: string; email: string; role: string }

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null);
  const token = ref<string | null>(localStorage.getItem('auth_token'));

  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === 'admin');

  async function login(email: string, password: string) {
    const { data } = await authApi.login(email, password);
    token.value = data.token;
    localStorage.setItem('auth_token', data.token);
  }

  async function logout() {
    try { await authApi.logout(); } catch { /* ignore */ }
    token.value = null;
    user.value = null;
    localStorage.removeItem('auth_token');
  }

  async function fetchUser() {
    if (!token.value) return;
    const { data } = await authApi.me();
    user.value = data;
  }

  return { user, token, isAuthenticated, isAdmin, login, logout, fetchUser };
});
