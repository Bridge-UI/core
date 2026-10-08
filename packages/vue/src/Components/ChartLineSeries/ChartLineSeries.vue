<script setup lang="ts">
// ** Local Imports
import type { ChartLineSeriesOwnProps } from "@/Components/ChartLineSeries/chartLineSeries.types";
import { useChartLineSeries } from "@/Components/ChartLineSeries/composables/useChartLineSeries";

const props = withDefaults(defineProps<ChartLineSeriesOwnProps>(), {
  area: undefined,
  step: undefined,
  dashed: undefined,
  labels: undefined,
  showPoints: undefined,
});

useChartLineSeries(props);
</script>

<template>
  <span hidden aria-hidden="true" />
</template>
