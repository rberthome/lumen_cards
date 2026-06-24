<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const topics = ['Kant', 'Kabbale', 'Franc-maçonnerie', 'Gnose', 'Stoïcisme', 'Hermétisme'];
</script>

<template>
  <section class="bg-neutral-950 px-6 py-24 text-center">
    <div class="mx-auto max-w-3xl flex flex-col gap-8">
      <div>
        <p class="mb-2 text-xs font-medium uppercase tracking-widest text-gold-500">
          {{ t('landing.philosophy.subtitle') }}
        </p>
        <h2 class="font-serif text-3xl font-bold text-white">{{ t('landing.philosophy.title') }}</h2>
      </div>
      <p class="text-neutral-400">{{ t('landing.philosophy.desc') }}</p>
      <div class="flex flex-wrap justify-center gap-3">
        <span
          v-for="topic in topics"
          :key="topic"
          class="rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-1.5 text-sm text-gold-300"
        >
          {{ topic }}
        </span>
      </div>
    </div>
  </section>
</template>
