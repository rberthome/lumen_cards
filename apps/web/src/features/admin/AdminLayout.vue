<script setup lang="ts">
import { computed } from 'vue';
import { RouterView, RouterLink, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useAuth } from '@/features/auth/composables/useAuth';

const { t } = useI18n();
const route = useRoute();
const auth = useAuthStore();
const { logout } = useAuth();

const allNavItems = [
  { path: '/admin/users', label: 'nav.users', icon: '👥', perm: 'user:manage' },
  { path: '/admin/stats', label: 'nav.stats', icon: '📊', perm: 'user:manage' },
  { path: '/admin/categories', label: 'admin.categories', icon: '🗂️', perm: 'category:manage' },
  { path: '/admin/decks', label: 'admin.decks', icon: '📚', perm: 'deck:edit' },
  { path: '/admin/cards', label: 'admin.cards', icon: '🃏', perm: 'card:edit' },
];

// Le modérateur ne voit que decks + cartes ; l'admin voit tout.
const navItems = computed(() => allNavItems.filter((item) => auth.hasPermission(item.perm)));
const panelLabel = computed(() => (auth.isAdmin ? t('nav.admin') : t('nav.moderation')));
</script>

<template>
  <div class="flex min-h-screen bg-neutral-50">
    <aside class="flex w-56 flex-col border-r border-neutral-200 bg-white px-3 py-6">
      <div class="mb-8 px-3">
        <span class="font-serif text-lg font-bold text-gold-600">LumenCards</span>
        <p class="text-xs text-neutral-400">{{ panelLabel }}</p>
      </div>

      <nav class="flex flex-1 flex-col gap-1">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          :class="[
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            route.path === item.path
              ? 'bg-gold-50 text-gold-700'
              : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900',
          ]"
        >
          <span class="text-base">{{ item.icon }}</span>
          {{ t(item.label) }}
        </RouterLink>
      </nav>

      <div class="border-t border-neutral-100 pt-4">
        <RouterLink
          to="/app/decks"
          class="mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-gold-50 hover:text-gold-700"
        >
          <span class="text-base">🎓</span>
          {{ t('nav.study') }}
        </RouterLink>
        <div class="px-3 pb-2 text-xs text-neutral-400">{{ auth.user?.name }}</div>
        <button
          class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
          @click="logout"
        >
          <span>↩</span>
          {{ t('nav.logout') }}
        </button>
      </div>
    </aside>

    <main class="flex-1 overflow-auto p-8">
      <RouterView />
    </main>
  </div>
</template>
