<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Button } from '@/design-system';
const { t } = useI18n();
</script>

<template>
  <section class="bg-gold-500 px-6 py-24 text-center">
    <div class="mx-auto max-w-2xl flex flex-col gap-4">
      <h2 class="font-serif text-3xl font-bold text-neutral-900">{{ t('landing.cta.title') }}</h2>
      <p class="text-neutral-800">{{ t('landing.cta.desc') }}</p>
      <div class="mt-4">
        <Button variant="secondary" size="lg">{{ t('landing.cta.button') }}</Button>
      </div>
    </div>
  </section>
</template>
