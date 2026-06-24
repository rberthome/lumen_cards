<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { Button, Badge } from '@/design-system';
import { useDeck } from '../composables/useDecks';

const props = defineProps<{ id: string }>();
const { t } = useI18n();
const router = useRouter();
const { deck, loading } = useDeck(Number(props.id));

function startReview() { router.push(`/app/review/${props.id}`); }
</script>

<template>
  <div v-if="loading" class="flex items-center justify-center py-20">
    <div class="h-8 w-8 animate-spin rounded-full border-2 border-gold-400 border-t-transparent" />
  </div>

  <div v-else-if="deck" class="mx-auto max-w-2xl flex flex-col gap-6">
    <button class="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700" @click="router.push('/app/decks')">
      ← {{ t('common.back') }}
    </button>

    <div class="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div class="flex items-center gap-4 mb-4">
        <span class="text-5xl">{{ deck.cover_emoji || '📚' }}</span>
        <div>
          <h1 class="text-2xl font-bold text-neutral-900">{{ deck.title }}</h1>
          <p v-if="deck.description" class="mt-1 text-neutral-500">{{ deck.description }}</p>
        </div>
      </div>

      <div class="flex gap-4 text-sm border-t border-neutral-100 pt-4">
        <span class="text-neutral-500">{{ deck.card_count }} {{ t('study.cards') }}</span>
        <Badge v-if="deck.due_today > 0" variant="gold">
          {{ deck.due_today }} {{ t('study.due_today') }}
        </Badge>
        <Badge v-else variant="success">{{ t('study.up_to_date') }}</Badge>
      </div>
    </div>

    <div class="flex gap-3">
      <Button
        :disabled="deck.card_count === 0"
        @click="startReview"
      >
        {{ deck.due_today > 0 ? t('study.review_due', { count: deck.due_today }) : t('study.review_all') }}
      </Button>
      <Button variant="secondary" @click="router.push('/app/decks')">{{ t('common.back') }}</Button>
    </div>
  </div>
</template>
