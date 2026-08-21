<script setup lang="ts">
// ** Local Imports
import { useTable } from "@/Components/Table/composables/useTable";
import type { TableOwnProps, TableSlots } from "@/Components/Table/table.types";

defineSlots<TableSlots>();

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TableOwnProps>(), {
  full: true,
  striped: false,
  hoverable: false,
  stickyHeader: false,
});

const { rootBind, tableBind } = useTable(props, {
  size: "md",
  full: true,
  rounded: "lg",
  striped: false,
  variant: "plain",
  hoverable: false,
  stickyHeader: false,
});
</script>

<template>
  <div v-bind="rootBind">
    <table v-bind="tableBind">
      <slot />
    </table>
  </div>
</template>
