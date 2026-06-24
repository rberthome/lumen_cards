<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { DataTable, Button, Badge } from '@/design-system';
import CategoryFormDialog from '../components/CategoryFormDialog.vue';
import { useCategories } from '../composables/useCategories';
import type { CategoryDto } from '../types';

const { t } = useI18n();
const { categories, loading, load, create, update, remove } = useCategories();

const dialogOpen = ref(false);
const editTarget = ref<CategoryDto | null>(null);
const deleteId = ref<number | null>(null);
const actionLoading = ref(false);

onMounted(load);

const columns = [
  { key: 'cover_emoji' as keyof CategoryDto, label: '' },
  { key: 'name' as keyof CategoryDto, label: t('category.name') },
  { key: 'slug' as keyof CategoryDto, label: t('category.slug') },
  { key: 'deck_count' as keyof CategoryDto, label: t('admin.deck_count', { count: '' }).trim() },
  { key: 'sort_order' as keyof CategoryDto, label: t('category.sort_order') },
];

function openCreate() { editTarget.value = null; dialogOpen.value = true; }
function openEdit(cat: CategoryDto) { editTarget.value = cat; dialogOpen.value = true; }

async function onSave(payload: Parameters<typeof create>[0]) {
  actionLoading.value = true;
  try {
    if (editTarget.value) {
      await update(editTarget.value.id, payload);
    } else {
      await create(payload);
    }
    dialogOpen.value = false;
  } finally {
    actionLoading.value = false;
  }
}

async function onDelete(id: number) {
  if (!confirm(t('common.confirm') + ' ?')) return;
  await remove(id);
  deleteId.value = null;
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-neutral-900">{{ t('admin.categories') }}</h1>
      <Button @click="openCreate">{{ t('admin.new_category') }}</Button>
    </div>

    <DataTable :columns="columns" :rows="categories" :loading="loading" :empty-text="t('admin.categories')">
      <template #cell-cover_emoji="{ value }">
        <span class="text-xl">{{ value || '—' }}</span>
      </template>
      <template #cell-name="{ value }">
        <span class="font-medium text-neutral-900">{{ value }}</span>
      </template>
      <template #cell-deck_count="{ value }">
        <Badge variant="gold">{{ value }}</Badge>
      </template>
      <template #actions="{ row }">
        <div class="flex gap-2">
          <Button variant="secondary" size="sm" @click="openEdit(row as CategoryDto)">
            {{ t('common.actions') }}
          </Button>
          <Button variant="danger" size="sm" @click="onDelete((row as CategoryDto).id)">
            {{ t('common.delete') }}
          </Button>
        </div>
      </template>
    </DataTable>

    <CategoryFormDialog
      :open="dialogOpen"
      :category="editTarget"
      @close="dialogOpen = false"
      @save="onSave"
    />
  </div>
</template>
