<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { Modal, Input, Button } from '@/design-system';
import type { AdminDeckDto, CategoryDto } from '../types';

const props = defineProps<{
  open: boolean;
  deck?: AdminDeckDto | null;
  categories: CategoryDto[];
}>();

const emit = defineEmits<{
  close: [];
  save: [payload: { title: string; description?: string; category_id?: number | null; cover_emoji?: string }];
}>();

const { t } = useI18n();
const saving = ref(false);

const form = ref({ title: '', description: '', category_id: '' as string | number, cover_emoji: '' });

watch(() => props.open, (v) => {
  if (v) {
    form.value = {
      title: props.deck?.title ?? '',
      description: props.deck?.description ?? '',
      category_id: props.deck?.category_id ?? '',
      cover_emoji: props.deck?.cover_emoji ?? '',
    };
  }
});

async function submit() {
  if (!form.value.title.trim()) return;
  saving.value = true;
  try {
    emit('save', {
      title: form.value.title.trim(),
      description: form.value.description.trim() || undefined,
      category_id: form.value.category_id ? Number(form.value.category_id) : null,
      cover_emoji: form.value.cover_emoji.trim() || undefined,
    });
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <Modal
    :open="open"
    :title="deck ? t('admin.edit_deck') : t('admin.new_deck')"
    @close="emit('close')"
  >
    <form class="flex flex-col gap-4" @submit.prevent="submit">
      <Input v-model="form.title" :label="t('deck.title')" :placeholder="t('deck.title')" />
      <div class="flex gap-3">
        <div class="flex-1">
          <label class="mb-1 block text-sm font-medium text-neutral-700">{{ t('deck.category') }}</label>
          <select
            v-model="form.category_id"
            class="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200"
          >
            <option value="">{{ t('admin.no_category') }}</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.cover_emoji ? cat.cover_emoji + ' ' : '' }}{{ cat.name }}
            </option>
          </select>
        </div>
        <div class="w-24">
          <Input v-model="form.cover_emoji" :label="t('deck.cover_emoji')" placeholder="📚" />
        </div>
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium text-neutral-700">{{ t('deck.description') }}</label>
        <textarea
          v-model="form.description"
          rows="3"
          class="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200"
          :placeholder="t('deck.description')"
        />
      </div>
      <div class="flex justify-end gap-3 pt-2">
        <Button variant="secondary" type="button" @click="emit('close')">{{ t('common.cancel') }}</Button>
        <Button variant="primary" type="submit" :loading="saving">{{ t('common.save') }}</Button>
      </div>
    </form>
  </Modal>
</template>
