<script setup lang="ts">
// ** Local Imports
import type { ChartBarSeriesOwnProps } from "@/Components/ChartBarSeries/chartBarSeries.types";
import { useChartBarSeries } from "@/Components/ChartBarSeries/composables/useChartBarSeries";

const props = withDefaults(defineProps<ChartBarSeriesOwnProps>(), {
  labels: undefined,
});

useChartBarSeries(props);
</script>

<template>
  <span hidden aria-hidden="true" />
</template>
