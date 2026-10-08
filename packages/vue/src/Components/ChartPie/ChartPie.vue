<script setup lang="ts">
// ** Local Imports
import type {
  ChartPieOwnProps,
  ChartPieSlots,
} from "@/Components/ChartPie/chartPie.types";
import { useChartPie } from "@/Components/ChartPie/composables/useChartPie";
import { ChartFrame } from "@/Utils/Chart";

defineSlots<ChartPieSlots>();

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ChartPieOwnProps>(), {
  loading: false,
  labels: undefined,
  animation: undefined,
});

const { frame, variant } = useChartPie(props, {
  size: "md",
  minAngle: 2,
  height: 280,
  labels: false,
  thickness: 0.3,
  variant: "pie",
  animation: true,
});
</script>

<template>
  <ChartFrame
    :frame="frame"
    :show-center="variant === 'donut' && !!$slots.center"
  >
    <slot />
    <template #center v-if="$slots.center"><slot name="center" /></template>
    <template #empty v-if="$slots.empty"><slot name="empty" /></template>
    <template #loading v-if="$slots.loading"><slot name="loading" /></template>
  </ChartFrame>
</template>
