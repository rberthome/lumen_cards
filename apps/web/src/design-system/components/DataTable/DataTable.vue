<script setup lang="ts" generic="T extends Record<string, unknown>">
defineProps<{
  columns: { key: keyof T; label: string; class?: string }[];
  rows: T[];
  loading?: boolean;
  emptyText?: string;
}>();
</script>

<template>
  <div class="overflow-x-auto rounded-xl border border-neutral-200">
    <table class="w-full text-sm">
      <thead class="bg-neutral-50 text-neutral-600">
        <tr>
          <th
            v-for="col in columns"
            :key="String(col.key)"
            :class="['px-4 py-3 text-left font-medium', col.class]"
          >
            {{ col.label }}
          </th>
          <th class="px-4 py-3"><span class="sr-only">Actions</span></th>
        </tr>
      </thead>
      <tbody class="divide-y divide-neutral-100 bg-white">
        <tr v-if="loading">
          <td :colspan="columns.length + 1" class="px-4 py-8 text-center text-neutral-400">
            <span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gold-400 border-t-transparent" />
          </td>
        </tr>
        <tr v-else-if="!rows.length">
          <td :colspan="columns.length + 1" class="px-4 py-8 text-center text-neutral-400">
            {{ emptyText ?? 'Aucune donnée' }}
          </td>
        </tr>
        <tr
          v-for="(row, i) in rows"
          v-else
          :key="i"
          class="hover:bg-neutral-50 transition-colors"
        >
          <td v-for="col in columns" :key="String(col.key)" class="px-4 py-3 text-neutral-900">
            <slot :name="`cell-${String(col.key)}`" :value="row[col.key]" :row="row">
              {{ row[col.key] }}
            </slot>
          </td>
          <td class="px-4 py-3">
            <slot name="actions" :row="row" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
