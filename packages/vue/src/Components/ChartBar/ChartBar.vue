<script setup lang="ts">
// ** Local Imports
import type { ChartBarOwnProps } from "@/Components/ChartBar/chartBar.types";
import { useChartBar } from "@/Components/ChartBar/composables/useChartBar";
import { ChartFrame, type ChartSlots } from "@/Utils/Chart";

defineSlots<ChartSlots>();

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ChartBarOwnProps>(), {
  loading: false,
  labels: undefined,
  animation: undefined,
});

const { frame } = useChartBar(props, {
  radius: 4,
  size: "md",
  height: 280,
  labels: false,
  animation: true,
  orientation: "vertical",
});
</script>

<template>
  <ChartFrame :frame="frame">
    <slot />
    <template #empty v-if="$slots.empty"><slot name="empty" /></template>
    <template #loading v-if="$slots.loading"><slot name="loading" /></template>
  </ChartFrame>
</template>
