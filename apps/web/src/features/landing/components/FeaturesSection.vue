<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Card } from '@/design-system';
const { t } = useI18n();

const features = [
  { icon: '🔁', key: 'sm2' },
  { icon: '✨', key: 'ai' },
  { icon: '⚜️', key: 'levels' },
] as const;
</script>

<template>
  <section class="bg-white px-6 py-24">
    <div class="mx-auto max-w-5xl">
      <h2 class="mb-12 text-center font-serif text-3xl font-bold text-neutral-900">
        {{ t('landing.features.title') }}
      </h2>
      <div class="grid gap-6 sm:grid-cols-3">
        <Card v-for="f in features" :key="f.key" class="flex flex-col gap-3 text-center">
          <span class="text-4xl">{{ f.icon }}</span>
          <h3 class="font-semibold text-neutral-900">{{ t(`landing.features.${f.key}.title`) }}</h3>
          <p class="text-sm text-neutral-500">{{ t(`landing.features.${f.key}.desc`) }}</p>
        </Card>
      </div>
    </div>
  </section>
</template>
