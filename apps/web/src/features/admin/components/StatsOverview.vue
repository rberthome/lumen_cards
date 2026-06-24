<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Card } from '@/design-system';
import type { AdminStats } from '../types';

defineProps<{ stats: AdminStats | null }>();
const { t } = useI18n();
</script>

<template>
  <div v-if="stats" class="grid grid-cols-2 gap-4 sm:grid-cols-4">
    <Card>
      <p class="text-2xl font-bold text-gold-600">{{ stats.total_users }}</p>
      <p class="text-sm text-neutral-500">{{ t('admin.users') }}</p>
    </Card>
    <Card>
      <p class="text-2xl font-bold text-indigo-600">{{ stats.active_today }}</p>
      <p class="text-sm text-neutral-500">Actifs aujourd'hui</p>
    </Card>
    <Card>
      <p class="text-2xl font-bold text-neutral-900">{{ stats.total_cards_reviewed }}</p>
      <p class="text-sm text-neutral-500">Cartes révisées</p>
    </Card>
    <Card>
      <p class="text-2xl font-bold text-green-600">{{ Math.round(stats.average_accuracy * 100) }}%</p>
      <p class="text-sm text-neutral-500">Précision moyenne</p>
    </Card>
  </div>
</template>
