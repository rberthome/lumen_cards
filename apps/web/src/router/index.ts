import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/features/auth/store/authStore';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/features/landing/LandingView.vue'),
      meta: { layout: 'landing' },
    },
    {
      path: '/admin',
      component: () => import('@/features/admin/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: '', redirect: '/admin/users' },
        { path: 'users', component: () => import('@/features/admin/views/AdminUsersView.vue') },
        { path: 'stats', component: () => import('@/features/admin/views/AdminStatsView.vue') },
        { path: 'categories', component: () => import('@/features/admin/views/AdminCategoriesView.vue') },
        { path: 'decks', component: () => import('@/features/admin/views/AdminDecksView.vue') },
        { path: 'cards', component: () => import('@/features/admin/views/AdminCardsView.vue') },
      ],
    },
    {
      path: '/login',
      component: () => import('@/features/auth/views/LoginView.vue'),
      meta: { layout: 'auth' },
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { path: '/login', query: { redirect: to.fullPath } };
  }
});

export default router;
