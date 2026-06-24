import { useAsync } from '@/shared/composables/useAsync';
import { useAdminStore } from '../store/adminStore';
import { adminApi } from '../api/adminApi';
import { useToastStore } from '@/stores/toast';
import { useI18n } from 'vue-i18n';

export function useUserDelete() {
  const { execute, loading, error } = useAsync();
  const store = useAdminStore();
  const toast = useToastStore();
  const { t } = useI18n();

  async function deleteUser(userId: number) {
    await execute(() => adminApi.deleteUser(userId));
    store.removeUser(userId);
    toast.success(t('rgpd.anonymized'));
  }

  return { deleteUser, loading, error };
}
