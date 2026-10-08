<script setup lang="ts">
// ** Local Imports
import type { ChartScatterSeriesOwnProps } from "@/Components/ChartScatterSeries/chartScatterSeries.types";
import { useChartScatterSeries } from "@/Components/ChartScatterSeries/composables/useChartScatterSeries";

const props = defineProps<ChartScatterSeriesOwnProps>();

useChartScatterSeries(props);
</script>

<template>
  <span hidden aria-hidden="true" />
</template>
