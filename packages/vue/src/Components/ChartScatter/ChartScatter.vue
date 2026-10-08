<script setup lang="ts">
// ** Local Imports
import type { ChartScatterOwnProps } from "@/Components/ChartScatter/chartScatter.types";
import { useChartScatter } from "@/Components/ChartScatter/composables/useChartScatter";
import { ChartFrame, type ChartSlots } from "@/Utils/Charts";

defineSlots<ChartSlots>();

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ChartScatterOwnProps>(), {
  loading: false,
  animation: undefined,
});

const { frame } = useChartScatter(props, {
  size: "md",
  height: 280,
  symbolSize: 8,
  animation: true,
});
</script>

<template>
  <ChartFrame :frame="frame">
    <slot />
    <template #empty v-if="$slots.empty"><slot name="empty" /></template>
    <template #loading v-if="$slots.loading"><slot name="loading" /></template>
  </ChartFrame>
</template>
