<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { DataTable, Button, Badge, Input } from '@/design-system';
import CardFormDialog from '../components/CardFormDialog.vue';
import { useCards } from '../composables/useCards';
import { useDecks } from '../composables/useDecks';
import type { AdminCardDto } from '../types';

const { t } = useI18n();
const { cards, loading, load, onSearch, onDeck, create, update, remove } = useCards();
const { decks, load: loadDecks } = useDecks();

const dialogOpen = ref(false);
const editTarget = ref<AdminCardDto | null>(null);
const searchValue = ref('');

onMounted(async () => {
  await Promise.all([load(), loadDecks()]);
});

const columns = [
  { key: 'front' as keyof AdminCardDto, label: t('card.front') },
  { key: 'back' as keyof AdminCardDto, label: t('card.back') },
  { key: 'deck_title' as keyof AdminCardDto, label: t('card.deck') },
  { key: 'difficulty' as keyof AdminCardDto, label: t('card.difficulty') },
  { key: 'tags' as keyof AdminCardDto, label: t('card.tags') },
  { key: 'created_at' as keyof AdminCardDto, label: t('common.created_at') },
];

const difficultyVariant: Record<string, 'success' | 'gold' | 'neutral'> = {
  easy: 'success',
  medium: 'gold',
  hard: 'neutral',
};

function openCreate() { editTarget.value = null; dialogOpen.value = true; }
function openEdit(card: AdminCardDto) { editTarget.value = card; dialogOpen.value = true; }

async function onSave(payload: Parameters<typeof create>[0]) {
  if (editTarget.value) {
    await update(editTarget.value.id, payload);
  } else {
    await create(payload);
  }
  dialogOpen.value = false;
}

async function onDelete(id: number) {
  if (!confirm(t('common.confirm') + ' ?')) return;
  await remove(id);
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-neutral-900">{{ t('admin.cards') }}</h1>
      <Button @click="openCreate">{{ t('admin.new_card') }}</Button>
    </div>

    <div class="flex gap-3">
      <div class="w-72">
        <Input
          v-model="searchValue"
          :placeholder="t('admin.search_cards')"
          @input="onSearch(searchValue)"
        />
      </div>
      <select
        class="rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-gold-400 focus:outline-none"
        @change="onDeck(($event.target as HTMLSelectElement).value ? Number(($event.target as HTMLSelectElement).value) : undefined)"
      >
        <option value="">{{ t('admin.all_decks') }}</option>
        <option v-for="d in decks" :key="d.id" :value="d.id">
          {{ d.title }}
        </option>
      </select>
    </div>

    <DataTable :columns="columns" :rows="cards" :loading="loading" :empty-text="t('admin.cards')">
      <template #cell-front="{ value }">
        <span class="line-clamp-2 max-w-xs font-medium text-neutral-900">{{ value }}</span>
      </template>
      <template #cell-back="{ value }">
        <span class="line-clamp-2 max-w-xs text-neutral-500">{{ value }}</span>
      </template>
      <template #cell-deck_title="{ value }">
        <span class="text-sm text-neutral-600">{{ value }}</span>
      </template>
      <template #cell-difficulty="{ value }">
        <Badge :variant="difficultyVariant[value as string] ?? 'neutral'">
          {{ t(`card.difficulty_${value}`) }}
        </Badge>
      </template>
      <template #cell-tags="{ value }">
        <div class="flex flex-wrap gap-1">
          <span
            v-for="tag in (value as string[])"
            :key="tag"
            class="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600"
          >{{ tag }}</span>
        </div>
      </template>
      <template #cell-created_at="{ value }">
        <span class="text-xs text-neutral-500">{{ new Date(value as string).toLocaleDateString('fr-FR') }}</span>
      </template>
      <template #actions="{ row }">
        <div class="flex gap-2">
          <Button variant="secondary" size="sm" @click="openEdit(row as AdminCardDto)">
            {{ t('common.actions') }}
          </Button>
          <Button variant="danger" size="sm" @click="onDelete((row as AdminCardDto).id)">
            {{ t('common.delete') }}
          </Button>
        </div>
      </template>
    </DataTable>

    <CardFormDialog
      :open="dialogOpen"
      :card="editTarget"
      :decks="decks"
      @close="dialogOpen = false"
      @save="onSave"
    />
  </div>
</template>
