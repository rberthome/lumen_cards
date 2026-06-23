<script setup lang="ts">
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAdminStore } from '../store/adminStore';
import StatsOverview from '../components/StatsOverview.vue';

const { t } = useI18n();
const store = useAdminStore();
onMounted(store.fetchStats);
</script>

<template>
  <div class="flex flex-col gap-6">
    <h1 class="text-2xl font-bold text-neutral-900">{{ t('admin.stats') }}</h1>
    <StatsOverview :stats="store.stats" />
  </div>
</template>
