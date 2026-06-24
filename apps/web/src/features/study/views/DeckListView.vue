<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import DeckCard from '../components/DeckCard.vue';
import { useDecks } from '../composables/useDecks';

const { t } = useI18n();
const router = useRouter();
const { decks, loading } = useDecks();
const search = ref('');
const activeCategory = ref<number | null>(null);

// Chips dérivées des decks chargés : seules les catégories avec des decks publiés apparaissent.
const categories = computed(() => {
  const seen = new Map<number, string>();
  for (const d of decks.value) {
    if (d.category_id != null && d.category_name) seen.set(d.category_id, d.category_name);
  }
  return [...seen].map(([id, name]) => ({ id, name }));
});

const filtered = computed(() =>
  decks.value.filter((d) => {
    const matchesSearch = !search.value || d.title.toLowerCase().includes(search.value.toLowerCase());
    const matchesCategory = activeCategory.value === null || d.category_id === activeCategory.value;
    return matchesSearch && matchesCategory;
  }),
);

const totalDue = computed(() => decks.value.reduce((sum, d) => sum + d.due_today, 0));

function startDeck(id: number) { router.push(`/app/review/${id}`); }
</script>

<template>
  <div class="flex flex-col gap-6">
    <div>
      <h1 class="text-2xl font-bold text-neutral-900">{{ t('study.my_decks') }}</h1>
      <p v-if="totalDue > 0" class="mt-1 text-sm text-gold-600 font-medium">
        {{ totalDue }} {{ t('study.cards_due') }}
      </p>
    </div>

    <input
      v-model="search"
      type="search"
      :placeholder="t('study.search_decks')"
      class="w-full max-w-sm rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200"
    />

    <!-- Filtre catégories -->
    <div v-if="categories.length" class="flex flex-wrap gap-2">
      <button
        type="button"
        :class="[
          'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
          activeCategory === null
            ? 'bg-gold-600 text-white'
            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200',
        ]"
        @click="activeCategory = null"
      >
        {{ t('study.all_categories') }}
      </button>
      <button
        v-for="cat in categories"
        :key="cat.id"
        type="button"
        :class="[
          'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
          activeCategory === cat.id
            ? 'bg-gold-600 text-white'
            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200',
        ]"
        @click="activeCategory = cat.id"
      >
        {{ cat.name }}
      </button>
    </div>

    <div v-if="loading" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="i in 3" :key="i" class="h-32 rounded-2xl bg-neutral-100 animate-pulse" />
    </div>

    <div v-else-if="filtered.length" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <DeckCard
        v-for="deck in filtered"
        :key="deck.id"
        :deck="deck"
        @start="startDeck"
      />
    </div>

    <div v-else class="flex flex-col items-center gap-3 py-16 text-neutral-400">
      <span class="text-5xl">📭</span>
      <p class="text-sm">{{ t('study.no_decks') }}</p>
    </div>
  </div>
</template>
