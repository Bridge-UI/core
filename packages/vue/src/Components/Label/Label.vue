<script setup lang="ts">
// ** External Imports
import { useSlots } from "vue";

// ** Local Imports
import { useLabel } from "@/Components/Label/composables/useLabel";
import type { LabelOwnProps } from "@/Components/Label/label.types";
import { resolveNamedSlot } from "@/Utils";

const slots = useSlots();

defineOptions({ inheritAttrs: false });

const props = defineProps<LabelOwnProps>();

const { merged, rootBind, requiredBind } = useLabel(props, {
  size: "md",
});
</script>

<template>
  <label v-bind="rootBind">
    <component :is="resolveNamedSlot(slots, 'default')" />

    <span v-bind="requiredBind" v-if="merged.required">*</span>
  </label>
</template>
