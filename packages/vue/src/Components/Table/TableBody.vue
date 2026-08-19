<script setup lang="ts">
// ** Local Imports
import { useTablePart } from "@/Components/Table/composables/useTablePart";
import type {
  TableBodyOwnProps,
  TableBodySlots,
} from "@/Components/Table/table.types";

defineSlots<TableBodySlots>();

defineOptions({ inheritAttrs: false });

const props = defineProps<TableBodyOwnProps>();

const { rootBind } = useTablePart(props, "body");
</script>

<template>
  <tbody v-bind="rootBind">
    <slot />
  </tbody>
</template>
