<script setup lang="ts">
// ** Local Imports
import type { ChartSeriesOwnProps } from "@/Components/ChartSeries/chartSeries.types";
import { useChartSeries } from "@/Components/ChartSeries/composables/useChartSeries";

const props = defineProps<ChartSeriesOwnProps>();

useChartSeries(props, { type: "line", curve: "linear" });
</script>

<template>
  <span hidden aria-hidden="true" />
</template>
