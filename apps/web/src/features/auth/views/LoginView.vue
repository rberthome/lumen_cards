<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import LoginForm from '../components/LoginForm.vue';
const { t } = useI18n();
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-neutral-50">
    <div class="w-full max-w-sm rounded-2xl bg-white p-8 shadow-md">
      <h1 class="mb-6 text-center font-serif text-2xl font-bold text-neutral-900">
        {{ t('app.name') }}
      </h1>
      <LoginForm />
    </div>
  </div>
</template>
