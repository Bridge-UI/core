<script setup lang="ts">
// ** Local Imports
import { useProgress } from "@/Components/Progress/composables/useProgress";
import type { ProgressOwnProps } from "@/Components/Progress/progress.types";

defineOptions({ inheritAttrs: false });

const props = defineProps<ProgressOwnProps>();

const { barBind, isBuffer, rootBind, trackBind, bufferBind } = useProgress(
  props,
  {
    size: "md",
    rounded: "full",
    color: "primary",
    variant: "indeterminate",
  },
);
</script>

<template>
  <div v-bind="rootBind">
    <div v-bind="trackBind" />
    <div v-bind="bufferBind" v-if="isBuffer && bufferBind" />
    <div v-bind="barBind" />
  </div>
</template>
