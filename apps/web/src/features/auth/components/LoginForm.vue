<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuth } from '../composables/useAuth';
import { Button, Input } from '@/design-system';

const { t } = useI18n();
const { login, loading, error } = useAuth();

const email = ref('');
const password = ref('');
</script>

<template>
  <form class="flex flex-col gap-4" @submit.prevent="login(email, password)">
    <Input v-model="email" type="email" :label="t('auth.email')" :placeholder="t('auth.email')" />
    <Input v-model="password" type="password" :label="t('auth.password')" :placeholder="t('auth.password')" />
    <p v-if="error" class="text-sm text-red-600">{{ t('auth.invalid_credentials') }}</p>
    <Button type="submit" :loading="loading" class="w-full">{{ t('auth.submit') }}</Button>
  </form>
</template>
