<script setup lang="ts">
// ** Local Imports
import { useTableCell } from "@/Components/Table/composables/useTableCell";
import type {
  TableHeadOwnProps,
  TableHeadSlots,
} from "@/Components/Table/table.types";

defineSlots<TableHeadSlots>();

defineOptions({ inheritAttrs: false });

const props = defineProps<TableHeadOwnProps>();

const { rootBind } = useTableCell(props, "head");
</script>

<template>
  <th v-bind="rootBind">
    <slot />
  </th>
</template>
