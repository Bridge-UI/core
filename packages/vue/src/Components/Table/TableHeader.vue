<script setup lang="ts">
// ** Local Imports
import { useTablePart } from "@/Components/Table/composables/useTablePart";
import type {
  TableHeaderOwnProps,
  TableHeaderSlots,
} from "@/Components/Table/table.types";

defineSlots<TableHeaderSlots>();

defineOptions({ inheritAttrs: false });

const props = defineProps<TableHeaderOwnProps>();

const { rootBind } = useTablePart(props, "header");
</script>

<template>
  <thead v-bind="rootBind">
    <slot />
  </thead>
</template>
