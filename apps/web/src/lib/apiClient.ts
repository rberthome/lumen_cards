import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  withCredentials: true,
  headers: { Accept: 'application/json' },
});

apiClient.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response?.status === 401) {
      // Lazy import pour éviter la dépendance circulaire
      import('@/features/auth/store/authStore').then(({ useAuthStore }) => {
        useAuthStore().logout();
      });
    }
    return Promise.reject(error);
  },
);
