<script setup lang="ts">
// ** Local Imports
import type { ChartFunnelOwnProps } from "@/Components/ChartFunnel/chartFunnel.types";
import { useChartFunnel } from "@/Components/ChartFunnel/composables/useChartFunnel";
import { ChartFrame, type ChartSlots } from "@/Utils/Charts";

defineSlots<ChartSlots>();

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ChartFunnelOwnProps>(), {
  loading: false,
  labels: undefined,
  animation: undefined,
});

const { frame } = useChartFunnel(props, {
  size: "md",
  height: 280,
  labels: true,
  align: "center",
  animation: true,
  sort: "descending",
  labelPosition: "inside",
});
</script>

<template>
  <ChartFrame :frame="frame">
    <slot />
    <template #empty v-if="$slots.empty"><slot name="empty" /></template>
    <template #loading v-if="$slots.loading"><slot name="loading" /></template>
  </ChartFrame>
</template>
