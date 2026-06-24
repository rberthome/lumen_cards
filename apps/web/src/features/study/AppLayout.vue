<script setup lang="ts">
import { RouterView, RouterLink, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useAuth } from '@/features/auth/composables/useAuth';
import { useStats } from './composables/useStats';

const { t } = useI18n();
const route = useRoute();
const auth = useAuthStore();
const { logout } = useAuth();
const { stats } = useStats();

const navItems = [
  { path: '/app/decks', label: 'study.my_decks', icon: '📚' },
  { path: '/app/stats', label: 'study.my_stats', icon: '📊' },
];
</script>

<template>
  <div class="min-h-screen bg-neutral-50">
    <header class="border-b border-neutral-200 bg-white px-6 py-3">
      <div class="mx-auto flex max-w-5xl items-center justify-between">
        <RouterLink to="/app/decks" class="font-serif text-lg font-bold text-gold-600">LumenCards</RouterLink>

        <nav class="flex gap-1">
          <RouterLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            :class="[
              'flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
              route.path.startsWith(item.path)
                ? 'bg-gold-50 text-gold-700'
                : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900',
            ]"
          >
            {{ item.icon }} {{ t(item.label) }}
          </RouterLink>
        </nav>

        <div class="flex items-center gap-3">
          <span
            v-if="stats && stats.streak_days > 0"
            class="flex items-center gap-1 rounded-full bg-gold-50 px-2.5 py-1 text-sm font-semibold text-gold-700"
            :title="`${stats.streak_days} ${t('study.day_streak')}`"
          >
            🔥 {{ stats.streak_days }}
          </span>
          <span class="text-sm text-neutral-500">{{ auth.user?.name }}</span>
          <button
            class="text-sm text-neutral-400 hover:text-neutral-700"
            @click="logout"
          >
            {{ t('nav.logout') }}
          </button>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-5xl px-6 py-8">
      <RouterView />
    </main>
  </div>
</template>
