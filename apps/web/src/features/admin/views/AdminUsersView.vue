<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Input } from '@/design-system';
import UserTable from '../components/UserTable.vue';
import { useUsers } from '../composables/useUsers';

const { t } = useI18n();
const { users, loading, load, onSearch } = useUsers();
const searchValue = ref('');

onMounted(load);

function handleSearch() { onSearch(searchValue.value); }
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-neutral-900">{{ t('admin.users') }}</h1>
      <div class="w-72">
        <Input
          v-model="searchValue"
          :placeholder="t('admin.search_placeholder')"
          @input="handleSearch"
        />
      </div>
    </div>
    <UserTable :users="users" :loading="loading" />
  </div>
</template>
