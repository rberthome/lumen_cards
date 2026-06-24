import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/authStore';
import { useAsync } from '@/shared/composables/useAsync';
import { useToastStore } from '@/stores/toast';

export function useAuth() {
  const auth = useAuthStore();
  const router = useRouter();
  const toast = useToastStore();
  const { loading, error, execute } = useAsync();

  function redirectAfterAuth() {
    return auth.canAccessAdmin ? router.push('/admin') : router.push('/app/decks');
  }

  async function login(email: string, password: string) {
    await execute(() => auth.login(email, password));
    await redirectAfterAuth();
  }

  async function register(name: string, email: string, password: string, passwordConfirm: string) {
    await execute(() => auth.register(name, email, password, passwordConfirm));
    await redirectAfterAuth();
  }

  async function logout() {
    await auth.logout();
    toast.info('Déconnecté');
    await router.push('/login');
  }

  return { login, register, logout, loading, error, isAuthenticated: auth.isAuthenticated };
}
