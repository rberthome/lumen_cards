<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/features/auth/store/authStore';
import { Button } from '@/design-system';
const { t } = useI18n();
const auth = useAuthStore();
</script>

<template>
  <section class="relative flex min-h-screen flex-col items-center justify-center bg-neutral-950 px-6 text-center">
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.1)_0%,_transparent_70%)]" />
    <div class="relative z-10 flex flex-col items-center gap-6 max-w-3xl">
      <span class="rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-gold-400">
        LumenCards
      </span>
      <h1 class="font-serif text-5xl font-bold leading-tight text-white sm:text-6xl">
        {{ t('landing.hero.title') }}
      </h1>
      <p class="max-w-xl text-lg text-neutral-400">{{ t('landing.hero.subtitle') }}</p>
      <div class="flex gap-4">
        <RouterLink v-if="auth.isAuthenticated" to="/app/decks">
          <Button size="lg">{{ t('study.my_decks') }}</Button>
        </RouterLink>
        <template v-else>
          <RouterLink to="/register">
            <Button size="lg">{{ t('landing.hero.cta_primary') }}</Button>
          </RouterLink>
          <RouterLink to="/login">
            <Button variant="ghost" size="lg">{{ t('auth.login') }}</Button>
          </RouterLink>
        </template>
      </div>
    </div>
  </section>
</template>
