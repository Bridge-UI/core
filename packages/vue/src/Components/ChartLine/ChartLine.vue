<script setup lang="ts">
// ** Local Imports
import type { ChartLineOwnProps } from "@/Components/ChartLine/chartLine.types";
import { useChartLine } from "@/Components/ChartLine/composables/useChartLine";
import { ChartFrame, type ChartSlots } from "@/Utils/Charts";

defineSlots<ChartSlots>();

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ChartLineOwnProps>(), {
  loading: false,
  area: undefined,
  step: undefined,
  sparkline: false,
  labels: undefined,
  animation: undefined,
  showPoints: undefined,
});

const { frame } = useChartLine(props, {
  size: "md",
  area: false,
  step: false,
  height: 280,
  labels: false,
  animation: true,
  curve: "linear",
  showPoints: false,
});
</script>

<template>
  <ChartFrame :frame="frame">
    <slot />
    <template #empty v-if="$slots.empty"><slot name="empty" /></template>
    <template #loading v-if="$slots.loading"><slot name="loading" /></template>
  </ChartFrame>
</template>
