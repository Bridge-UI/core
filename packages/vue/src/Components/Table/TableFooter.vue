<script setup lang="ts">
// ** Local Imports
import { useTablePart } from "@/Components/Table/composables/useTablePart";
import type {
  TableFooterOwnProps,
  TableFooterSlots,
} from "@/Components/Table/table.types";

defineSlots<TableFooterSlots>();

defineOptions({ inheritAttrs: false });

const props = defineProps<TableFooterOwnProps>();

const { rootBind } = useTablePart(props, "footer");
</script>

<template>
  <tfoot v-bind="rootBind">
    <slot />
  </tfoot>
</template>
