<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { Modal, Input, Button } from '@/design-system';
import type { CategoryDto } from '../types';

const props = defineProps<{ open: boolean; category?: CategoryDto | null }>();
const emit = defineEmits<{
  close: [];
  save: [payload: { name: string; description?: string; cover_emoji?: string; sort_order?: number }];
}>();

const { t } = useI18n();
const saving = ref(false);

const form = ref({ name: '', description: '', cover_emoji: '', sort_order: 0 });

watch(() => props.open, (v) => {
  if (v) {
    form.value = {
      name: props.category?.name ?? '',
      description: props.category?.description ?? '',
      cover_emoji: props.category?.cover_emoji ?? '',
      sort_order: props.category?.sort_order ?? 0,
    };
  }
});

async function submit() {
  if (!form.value.name.trim()) return;
  saving.value = true;
  try {
    emit('save', {
      name: form.value.name.trim(),
      description: form.value.description.trim() || undefined,
      cover_emoji: form.value.cover_emoji.trim() || undefined,
      sort_order: form.value.sort_order || undefined,
    });
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <Modal
    :open="open"
    :title="category ? t('admin.edit_category') : t('admin.new_category')"
    @close="emit('close')"
  >
    <form class="flex flex-col gap-4" @submit.prevent="submit">
      <Input v-model="form.name" :label="t('category.name')" :placeholder="t('category.name')" />
      <div class="flex gap-3">
        <div class="flex-1">
          <Input v-model="form.cover_emoji" :label="t('category.cover_emoji')" placeholder="✨" />
        </div>
        <div class="w-28">
          <Input v-model.number="form.sort_order" :label="t('category.sort_order')" type="number" placeholder="0" />
        </div>
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium text-neutral-700">{{ t('category.description') }}</label>
        <textarea
          v-model="form.description"
          rows="3"
          class="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200"
          :placeholder="t('category.description')"
        />
      </div>
      <div class="flex justify-end gap-3 pt-2">
        <Button variant="secondary" type="button" @click="emit('close')">{{ t('common.cancel') }}</Button>
        <Button variant="primary" type="submit" :loading="saving">{{ t('common.save') }}</Button>
      </div>
    </form>
  </Modal>
</template>
