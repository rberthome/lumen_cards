<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { DataTable, Badge, Button } from '@/design-system';
import UserDeleteDialog from './UserDeleteDialog.vue';
import UserExportButton from './UserExportButton.vue';
import type { AdminUser } from '../types';

defineProps<{ users: AdminUser[]; loading: boolean }>();
const { t } = useI18n();

const deleteTarget = ref<AdminUser | null>(null);

const columns = [
  { key: 'name' as keyof AdminUser, label: t('common.actions') },
  { key: 'email' as keyof AdminUser, label: 'Email' },
  { key: 'level' as keyof AdminUser, label: t('common.level') },
  { key: 'xp' as keyof AdminUser, label: t('common.xp') },
  { key: 'created_at' as keyof AdminUser, label: t('common.created_at') },
];
</script>

<template>
  <DataTable :columns="columns" :rows="users" :loading="loading" :empty-text="t('admin.users')">
    <template #cell-name="{ value }">
      <span class="font-medium text-neutral-900">{{ value }}</span>
    </template>
    <template #cell-level="{ value }">
      <Badge variant="gold">{{ value }}</Badge>
    </template>
    <template #cell-created_at="{ value }">
      <span class="text-neutral-500 text-xs">{{ new Date(value as string).toLocaleDateString('fr-FR') }}</span>
    </template>
    <template #actions="{ row }">
      <div class="flex gap-2">
        <UserExportButton :user="row as AdminUser" />
        <Button variant="danger" size="sm" @click="deleteTarget = row as AdminUser">
          {{ t('common.delete') }}
        </Button>
      </div>
    </template>
  </DataTable>

  <UserDeleteDialog
    :user="deleteTarget"
    :open="!!deleteTarget"
    @close="deleteTarget = null"
    @deleted="deleteTarget = null"
  />
</template>
