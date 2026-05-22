<script setup lang="ts">
// ** Local Imports
import { useLabel } from "@/Components/Label/composables/useLabel";
import type { LabelOwnProps } from "@/Components/Label/label.types";

defineOptions({ inheritAttrs: false });

const props = defineProps<LabelOwnProps>();

const { merged, rootBind, requiredBind } = useLabel(props, {
  size: "md",
});
</script>

<template>
  <label v-bind="rootBind">
    <slot />

    <span v-if="merged.required" v-bind="requiredBind">*</span>
  </label>
</template>
