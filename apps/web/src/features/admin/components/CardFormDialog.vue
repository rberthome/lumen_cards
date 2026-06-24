<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { Modal, Input, Button } from '@/design-system';
import type { AdminCardDto, AdminDeckDto } from '../types';

const props = defineProps<{
  open: boolean;
  card?: AdminCardDto | null;
  decks: AdminDeckDto[];
  preselectedDeckId?: number;
}>();

const emit = defineEmits<{
  close: [];
  save: [payload: {
    deck_id: number;
    front: string;
    back: string;
    explanation?: string;
    wrong_answer_1?: string;
    wrong_answer_2?: string;
    wrong_answer_3?: string;
    source?: string;
    tags?: string[];
    difficulty?: 'easy' | 'medium' | 'hard';
  }];
}>();

const { t } = useI18n();
const saving = ref(false);

const form = ref({
  deck_id: '' as string | number,
  front: '',
  back: '',
  explanation: '',
  wrong_answer_1: '',
  wrong_answer_2: '',
  wrong_answer_3: '',
  source: '',
  tags: '',
  difficulty: 'medium' as 'easy' | 'medium' | 'hard',
});

watch(() => props.open, (v) => {
  if (v) {
    form.value = {
      deck_id: props.card?.deck_id ?? props.preselectedDeckId ?? '',
      front: props.card?.front ?? '',
      back: props.card?.back ?? '',
      explanation: props.card?.explanation ?? '',
      wrong_answer_1: props.card?.wrong_answer_1 ?? '',
      wrong_answer_2: props.card?.wrong_answer_2 ?? '',
      wrong_answer_3: props.card?.wrong_answer_3 ?? '',
      source: props.card?.source ?? '',
      tags: props.card?.tags?.join(', ') ?? '',
      difficulty: props.card?.difficulty ?? 'medium',
    };
  }
});

async function submit() {
  if (!form.value.front.trim() || !form.value.back.trim() || !form.value.deck_id) return;
  saving.value = true;
  const tags = form.value.tags.split(',').map((t) => t.trim()).filter(Boolean);
  try {
    emit('save', {
      deck_id: Number(form.value.deck_id),
      front: form.value.front.trim(),
      back: form.value.back.trim(),
      explanation: form.value.explanation.trim() || undefined,
      wrong_answer_1: form.value.wrong_answer_1.trim() || undefined,
      wrong_answer_2: form.value.wrong_answer_2.trim() || undefined,
      wrong_answer_3: form.value.wrong_answer_3.trim() || undefined,
      source: form.value.source.trim() || undefined,
      tags: tags.length ? tags : undefined,
      difficulty: form.value.difficulty,
    });
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <Modal
    :open="open"
    :title="card ? t('admin.edit_card') : t('admin.new_card')"
    @close="emit('close')"
  >
    <form class="flex max-h-[80vh] flex-col gap-4 overflow-y-auto pr-1" @submit.prevent="submit">
      <div class="flex gap-3">
        <div class="flex-1">
          <label class="mb-1 block text-sm font-medium text-neutral-700">{{ t('card.deck') }}</label>
          <select
            v-model="form.deck_id"
            class="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200"
          >
            <option value="" disabled>— {{ t('card.deck') }} —</option>
            <option v-for="d in decks" :key="d.id" :value="d.id">
              {{ d.cover_emoji ? d.cover_emoji + ' ' : '' }}{{ d.title }}
            </option>
          </select>
        </div>
        <div class="w-32">
          <label class="mb-1 block text-sm font-medium text-neutral-700">{{ t('card.difficulty') }}</label>
          <select
            v-model="form.difficulty"
            class="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200"
          >
            <option value="easy">{{ t('card.difficulty_easy') }}</option>
            <option value="medium">{{ t('card.difficulty_medium') }}</option>
            <option value="hard">{{ t('card.difficulty_hard') }}</option>
          </select>
        </div>
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-neutral-700">{{ t('card.front') }} *</label>
        <textarea
          v-model="form.front"
          rows="3"
          class="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200"
          :placeholder="t('card.front')"
        />
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-neutral-700">{{ t('card.back') }} *</label>
        <textarea
          v-model="form.back"
          rows="3"
          class="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200"
          :placeholder="t('card.back')"
        />
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-neutral-700">{{ t('card.explanation') }}</label>
        <textarea
          v-model="form.explanation"
          rows="2"
          class="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200"
          :placeholder="t('card.explanation')"
        />
      </div>

      <div class="grid grid-cols-3 gap-2">
        <Input v-model="form.wrong_answer_1" :label="t('card.wrong_answer_1')" :placeholder="t('card.wrong_answer_1')" />
        <Input v-model="form.wrong_answer_2" :label="t('card.wrong_answer_2')" :placeholder="t('card.wrong_answer_2')" />
        <Input v-model="form.wrong_answer_3" :label="t('card.wrong_answer_3')" :placeholder="t('card.wrong_answer_3')" />
      </div>

      <div class="flex gap-3">
        <div class="flex-1">
          <Input v-model="form.tags" :label="t('card.tags')" placeholder="philosophie, kant" />
        </div>
        <div class="flex-1">
          <Input v-model="form.source" :label="t('card.source')" placeholder="Critique de la raison pure" />
        </div>
      </div>

      <div class="flex justify-end gap-3 pt-2">
        <Button variant="secondary" type="button" @click="emit('close')">{{ t('common.cancel') }}</Button>
        <Button variant="primary" type="submit" :loading="saving">{{ t('common.save') }}</Button>
      </div>
    </form>
  </Modal>
</template>
