<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuth } from '../composables/useAuth';
import { Button, Input } from '@/design-system';

const { t } = useI18n();
const { register, loading, error } = useAuth();

const name = ref('');
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
</script>

<template>
  <form class="flex flex-col gap-4" @submit.prevent="register(name, email, password, passwordConfirm)">
    <Input v-model="name" :label="t('auth.name')" :placeholder="t('auth.name')" />
    <Input v-model="email" type="email" :label="t('auth.email')" :placeholder="t('auth.email')" />
    <Input v-model="password" :label="t('auth.password')" :placeholder="t('auth.password')" secure-text-entry />
    <Input v-model="passwordConfirm" :label="t('auth.password_confirm')" :placeholder="t('auth.password_confirm')" secure-text-entry />
    <p v-if="error" class="text-sm text-red-600">{{ t('errors.generic') }}</p>
    <Button type="submit" :loading="loading" class="w-full">{{ t('auth.register') }}</Button>
  </form>
</template>
