<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Button } from '@/design-system';
import type { DeckDto } from '@lumen_cards/types';

defineProps<{ deck: DeckDto }>();
defineEmits<{ start: [id: number] }>();
const { t } = useI18n();
</script>

<template>
  <div class="group flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
    <div class="flex items-start justify-between">
      <div class="flex items-center gap-3">
        <span class="text-3xl">{{ deck.cover_emoji || '📚' }}</span>
        <div>
          <h3 class="font-semibold text-neutral-900 group-hover:text-gold-700 transition-colors">{{ deck.title }}</h3>
          <p v-if="deck.description" class="mt-0.5 line-clamp-2 text-sm text-neutral-500">{{ deck.description }}</p>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between">
      <div class="flex gap-4 text-sm text-neutral-500">
        <span>{{ deck.card_count }} {{ t('study.cards') }}</span>
        <span v-if="deck.due_today > 0" class="font-medium text-gold-600">
          {{ deck.due_today }} {{ t('study.due_today') }}
        </span>
        <span v-else class="text-green-600">{{ t('study.up_to_date') }}</span>
      </div>
      <Button size="sm" @click="$emit('start', deck.id)">
        {{ t('study.review') }}
      </Button>
    </div>
  </div>
</template>
