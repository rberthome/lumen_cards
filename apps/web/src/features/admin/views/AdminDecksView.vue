<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { DataTable, Button, Badge, Input } from '@/design-system';
import DeckFormDialog from '../components/DeckFormDialog.vue';
import { useDecks } from '../composables/useDecks';
import { useCategories } from '../composables/useCategories';
import type { AdminDeckDto } from '../types';

const { t } = useI18n();
const { decks, loading, load, onSearch, onCategory, create, update, togglePublish, remove } = useDecks();
const { categories, load: loadCategories } = useCategories();

const dialogOpen = ref(false);
const editTarget = ref<AdminDeckDto | null>(null);
const searchValue = ref('');
const actionLoading = ref(false);

onMounted(async () => {
  await Promise.all([load(), loadCategories()]);
});

const columns = [
  { key: 'cover_emoji' as keyof AdminDeckDto, label: '' },
  { key: 'title' as keyof AdminDeckDto, label: t('deck.title') },
  { key: 'category_name' as keyof AdminDeckDto, label: t('deck.category') },
  { key: 'card_count' as keyof AdminDeckDto, label: t('admin.card_count', { count: '' }).trim() },
  { key: 'is_published' as keyof AdminDeckDto, label: t('deck.is_published') },
  { key: 'created_at' as keyof AdminDeckDto, label: t('common.created_at') },
];

function openCreate() { editTarget.value = null; dialogOpen.value = true; }
function openEdit(deck: AdminDeckDto) { editTarget.value = deck; dialogOpen.value = true; }

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
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-neutral-900">{{ t('admin.decks') }}</h1>
      <Button @click="openCreate">{{ t('admin.new_deck') }}</Button>
    </div>

    <div class="flex gap-3">
      <div class="w-72">
        <Input
          v-model="searchValue"
          :placeholder="t('admin.search_decks')"
          @input="onSearch(searchValue)"
        />
      </div>
      <select
        class="rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-gold-400 focus:outline-none"
        @change="onCategory(($event.target as HTMLSelectElement).value ? Number(($event.target as HTMLSelectElement).value) : undefined)"
      >
        <option value="">{{ t('admin.all_categories') }}</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>
    </div>

    <DataTable :columns="columns" :rows="decks" :loading="loading" :empty-text="t('admin.decks')">
      <template #cell-cover_emoji="{ value }">
        <span class="text-xl">{{ value || '—' }}</span>
      </template>
      <template #cell-title="{ value }">
        <span class="font-medium text-neutral-900">{{ value }}</span>
      </template>
      <template #cell-category_name="{ value }">
        <span class="text-neutral-500">{{ value || t('admin.no_category') }}</span>
      </template>
      <template #cell-card_count="{ value }">
        <Badge variant="gold">{{ value }}</Badge>
      </template>
      <template #cell-is_published="{ value }">
        <Badge :variant="value ? 'success' : 'neutral'">
          {{ value ? t('admin.published') : t('admin.draft') }}
        </Badge>
      </template>
      <template #cell-created_at="{ value }">
        <span class="text-xs text-neutral-500">{{ new Date(value as string).toLocaleDateString('fr-FR') }}</span>
      </template>
      <template #actions="{ row }">
        <div class="flex gap-2">
          <Button variant="ghost" size="sm" @click="togglePublish(row as AdminDeckDto)">
            {{ (row as AdminDeckDto).is_published ? t('admin.unpublish') : t('admin.publish') }}
          </Button>
          <Button variant="secondary" size="sm" @click="openEdit(row as AdminDeckDto)">
            {{ t('common.actions') }}
          </Button>
          <Button variant="danger" size="sm" @click="onDelete((row as AdminDeckDto).id)">
            {{ t('common.delete') }}
          </Button>
        </div>
      </template>
    </DataTable>

    <DeckFormDialog
      :open="dialogOpen"
      :deck="editTarget"
      :categories="categories"
      @close="dialogOpen = false"
      @save="onSave"
    />
  </div>
</template>
