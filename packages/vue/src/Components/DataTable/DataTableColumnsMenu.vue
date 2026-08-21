<script setup lang="ts">
// ** External Imports
import { ref } from "vue";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import { Checkbox } from "@/Components/Checkbox";
import type { DataTableVisibilityItem } from "@/Components/DataTable/composables/useDataTable";
import DataTableToolbarButton from "@/Components/DataTable/DataTableToolbarButton.vue";
import { Menu } from "@/Components/Menu";

defineOptions({ inheritAttrs: false, name: "DataTableColumnsMenu" });

defineProps<{
  items: DataTableVisibilityItem[];
}>();

const emit = defineEmits<{
  toggle: [columnId: string, hide: boolean];
}>();

const show = ref(false);
const resolveMessage = useResolveMessage();
</script>

<template>
  <Menu v-model="show" placement="bottom-end">
    <template #trigger>
      <DataTableToolbarButton
        icon="columns"
        :label="resolveMessage('Columns')"
      />
    </template>
    <div class="min-w-52 p-1">
      <div
        :key="item.id"
        v-for="item in items"
        role="menuitemcheckbox"
        :aria-checked="!item.hidden"
        v-on:click="item.hideable && emit('toggle', item.id, !item.hidden)"
        class="flex w-full cursor-pointer items-center rounded-md px-2 py-1.5 text-start hover:bg-dark-500/5 dark:hover:bg-dark-500/10"
      >
        <Checkbox
          size="sm"
          hide-error-message
          :end-label="item.label"
          :disabled="!item.hideable"
          :model-value="!item.hidden"
          :classes="{ root: 'pointer-events-none' }"
        />
      </div>
    </div>
  </Menu>
</template>
