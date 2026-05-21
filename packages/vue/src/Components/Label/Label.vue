<script setup lang="ts">
// ** External Imports
import { useAttrs } from "vue";

// ** Local Imports
import { useLabel } from "@/Components/Label/composables/useLabel";
import type { LabelOwnProps } from "@/Components/Label/label.types";

defineOptions({ inheritAttrs: false });

const attrs = useAttrs();

const props = defineProps<LabelOwnProps>();

const { rootBind, requiredBind, showRequired } = useLabel(props, attrs);
</script>

<template>
  <label v-bind="rootBind">
    <slot />

    <span v-if="showRequired" v-bind="requiredBind">*</span>
  </label>
</template>
