<script setup lang="ts">
// ** Local Imports
import { useSpinner } from "@/Components/Spinner/composables/useSpinner";
import type { SpinnerOwnProps } from "@/Components/Spinner/spinner.types";

defineOptions({ inheritAttrs: false });

const props = defineProps<SpinnerOwnProps>();

const { svgBind, rootBind, trackBind, circleBind, enableTrack } = useSpinner(
  props,
  {
    size: "md",
    thickness: 3.6,
    color: "primary",
    enableTrack: false,
    disableShrink: false,
    variant: "indeterminate",
  },
);
</script>

<template>
  <span v-bind="rootBind">
    <svg v-bind="svgBind">
      <circle v-bind="trackBind" v-if="enableTrack && trackBind" />
      <circle v-bind="circleBind" />
    </svg>
  </span>
</template>
