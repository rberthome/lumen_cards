<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/features/auth/store/authStore';
import { Button } from '@/design-system';
const { t } = useI18n();
const auth = useAuthStore();
</script>

<template>
  <section class="bg-gold-500 px-6 py-24 text-center">
    <div class="mx-auto max-w-2xl flex flex-col gap-4">
      <h2 class="font-serif text-3xl font-bold text-neutral-900">{{ t('landing.cta.title') }}</h2>
      <p class="text-neutral-800">{{ t('landing.cta.desc') }}</p>
      <div class="mt-4 flex justify-center gap-3">
        <RouterLink v-if="auth.isAuthenticated" to="/app/decks">
          <Button variant="secondary" size="lg">{{ t('study.my_decks') }}</Button>
        </RouterLink>
        <template v-else>
          <RouterLink to="/register">
            <Button size="lg">{{ t('landing.cta.button') }}</Button>
          </RouterLink>
          <RouterLink to="/login">
            <Button variant="secondary" size="lg">{{ t('auth.login') }}</Button>
          </RouterLink>
        </template>
      </div>
    </div>
  </section>
</template>
