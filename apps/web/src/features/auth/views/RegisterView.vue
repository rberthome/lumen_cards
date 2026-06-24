<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import RegisterForm from '../components/RegisterForm.vue';
const { t } = useI18n();
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-neutral-50">
    <div class="w-full max-w-sm rounded-2xl bg-white p-8 shadow-md">
      <h1 class="mb-2 text-center font-serif text-2xl font-bold text-neutral-900">{{ t('app.name') }}</h1>
      <p class="mb-6 text-center text-sm text-neutral-500">{{ t('auth.register_subtitle') }}</p>
      <RegisterForm />
      <p class="mt-4 text-center text-sm text-neutral-500">
        {{ t('auth.already_account') }}
        <RouterLink to="/login" class="font-medium text-gold-600 hover:underline">{{ t('auth.login') }}</RouterLink>
      </p>
    </div>
  </div>
</template>
