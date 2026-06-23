import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/authStore';
import { useAsync } from '@/shared/composables/useAsync';
import { useToastStore } from '@/stores/toast';

export function useAuth() {
  const auth = useAuthStore();
  const router = useRouter();
  const toast = useToastStore();
  const { loading, error, execute } = useAsync();

  async function login(email: string, password: string) {
    await execute(() => auth.login(email, password));
    await auth.fetchUser();
    await router.push('/admin');
  }

  async function logout() {
    await auth.logout();
    toast.info('Déconnecté');
    await router.push('/login');
  }

  return { login, logout, loading, error, isAuthenticated: auth.isAuthenticated };
}
