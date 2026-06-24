import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authApi } from '../api/authApi';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role_slug: string | null;
  role_name: string | null;
  permissions: string[];
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null);
  const token = ref<string | null>(localStorage.getItem('auth_token'));

  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role_slug === 'admin');
  const canAccessAdmin = computed(() => (user.value?.permissions.length ?? 0) > 0);

  function hasPermission(permission: string): boolean {
    return user.value?.permissions.includes(permission) ?? false;
  }

  function setAuthData(tokenValue: string, userData: AuthUser) {
    token.value = tokenValue;
    user.value = userData;
    localStorage.setItem('auth_token', tokenValue);
  }

  async function login(email: string, password: string) {
    const { data } = await authApi.login(email, password);
    setAuthData(data.token, data.user);
  }

  async function register(name: string, email: string, password: string, passwordConfirm: string) {
    const { data } = await authApi.register(name, email, password, passwordConfirm);
    setAuthData(data.token, data.user);
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
    user.value = data.data;
  }

  return { user, token, isAuthenticated, isAdmin, canAccessAdmin, hasPermission, login, register, logout, fetchUser };
});
