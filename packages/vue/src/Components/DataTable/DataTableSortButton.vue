<script setup lang="ts">
// ** Core Imports
import type { DataTableSortIcon } from "@bridge-ui/core/Domain";

// ** Local Imports
import { Icon } from "@/Components/Icon";

defineOptions({ inheritAttrs: false, name: "DataTableSortButton" });

defineProps<{
  icon: DataTableSortIcon;
}>();

defineEmits<{
  click: [];
}>();
</script>

<template>
  <button
    type="button"
    v-on:click="$emit('click')"
    class="inline-flex min-w-0 cursor-pointer items-center gap-1.5 p-0 leading-none"
  >
    <slot />
    <span
      class="inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-sm leading-none hover:bg-dark-500/10 dark:hover:bg-dark-500/15"
    >
      <Icon size="sm" :icon="icon" />
    </span>
  </button>
</template>
