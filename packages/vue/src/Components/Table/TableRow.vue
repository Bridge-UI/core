<script setup lang="ts">
// ** Local Imports
import { useTableRow } from "@/Components/Table/composables/useTableRow";
import type {
  TableRowOwnProps,
  TableRowSlots,
} from "@/Components/Table/table.types";

defineSlots<TableRowSlots>();

defineOptions({ inheritAttrs: false });

const props = defineProps<TableRowOwnProps>();

const { rootBind } = useTableRow(props);
</script>

<template>
  <tr v-bind="rootBind">
    <slot />
  </tr>
</template>
