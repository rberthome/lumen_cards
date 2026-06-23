<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Modal, Button } from '@/design-system';
import { useUserDelete } from '../composables/useUserDelete';
import type { AdminUser } from '../types';

const props = defineProps<{ user: AdminUser | null; open: boolean }>();
const emit = defineEmits<{ close: []; deleted: [id: number] }>();

const { t } = useI18n();
const { deleteUser, loading } = useUserDelete();
const confirmed = ref(false);

async function onConfirm() {
  if (!props.user) return;
  await deleteUser(props.user.id);
  emit('deleted', props.user.id);
  emit('close');
  confirmed.value = false;
}
</script>

<template>
  <Modal :open="open" :title="t('rgpd.right_to_forget')" @close="$emit('close')">
    <div class="flex flex-col gap-4">
      <p class="text-sm text-neutral-600">{{ t('rgpd.right_to_forget_desc') }}</p>
      <p v-if="user" class="rounded-lg bg-neutral-50 px-4 py-2 text-sm font-medium text-neutral-900">
        {{ user.name }} — {{ user.email }}
      </p>
      <label class="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
        <input v-model="confirmed" type="checkbox" class="rounded text-red-600" />
        {{ t('rgpd.confirm') }}
      </label>
      <div class="flex gap-3 justify-end">
        <Button variant="ghost" @click="$emit('close')">{{ t('common.cancel') }}</Button>
        <Button variant="danger" :disabled="!confirmed" :loading="loading" @click="onConfirm">
          {{ t('common.delete') }}
        </Button>
      </div>
    </div>
  </Modal>
</template>
