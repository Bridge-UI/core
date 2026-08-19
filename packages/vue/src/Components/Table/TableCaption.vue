<script setup lang="ts">
// ** Local Imports
import { useTablePart } from "@/Components/Table/composables/useTablePart";
import type {
  TableCaptionOwnProps,
  TableCaptionSlots,
} from "@/Components/Table/table.types";

defineSlots<TableCaptionSlots>();

defineOptions({ inheritAttrs: false });

const props = defineProps<TableCaptionOwnProps>();

const { rootBind } = useTablePart(props, "caption");
</script>

<template>
  <caption v-bind="rootBind">
    <slot />
  </caption>
</template>
