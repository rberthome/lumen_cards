import { adminApi } from '../api/adminApi';
import { useToastStore } from '@/stores/toast';

export function useUserExport() {
  const toast = useToastStore();

  async function exportUser(userId: number, userName: string) {
    try {
      const blob = await adminApi.exportUserData(userId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lumencards_export_user_${userId}_${userName.replace(/\s+/g, '_')}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error('Export échoué');
    }
  }

  return { exportUser };
}
