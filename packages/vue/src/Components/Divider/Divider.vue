<script setup lang="ts">
// ** Local Imports
import { useDivider } from "@/Components/Divider/composables/useDivider";
import type { DividerOwnProps } from "@/Components/Divider/divider.types";

defineOptions({ inheritAttrs: false });

const props = defineProps<DividerOwnProps>();

const { rootBind } = useDivider(props, {
  color: "dark",
  orientation: "horizontal",
});
</script>

<template>
  <hr v-bind="rootBind" />
</template>
