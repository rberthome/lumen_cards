<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Button } from '@/design-system';
import { useUserExport } from '../composables/useUserExport';
import type { AdminUser } from '../types';

const props = defineProps<{ user: AdminUser }>();
const { t } = useI18n();
const { exportUser } = useUserExport();
</script>

<template>
  <Button variant="secondary" size="sm" @click="exportUser(props.user.id, props.user.name)">
    {{ t('admin.export_user') }}
  </Button>
</template>
