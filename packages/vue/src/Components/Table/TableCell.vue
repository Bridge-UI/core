<script setup lang="ts">
// ** Local Imports
import { useTableCell } from "@/Components/Table/composables/useTableCell";
import type {
  TableCellOwnProps,
  TableCellSlots,
} from "@/Components/Table/table.types";

defineSlots<TableCellSlots>();

defineOptions({ inheritAttrs: false });

const props = defineProps<TableCellOwnProps>();

const { rootBind } = useTableCell(props, "cell");
</script>

<template>
  <td v-bind="rootBind">
    <slot />
  </td>
</template>
