import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/api',
  headers: { Accept: 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isHandling401 = false;
apiClient.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response?.status === 401 && !isHandling401) {
      isHandling401 = true;
      import('@/features/auth/store/authStore').then(({ useAuthStore }) => {
        useAuthStore().logout();
        isHandling401 = false;
      });
    }
    return Promise.reject(error);
  },
);
