<script setup lang="ts">
// ** Local Imports
import type { ChartAxisOwnProps } from "@/Components/ChartAxis/chartAxis.types";
import { useChartAxis } from "@/Components/ChartAxis/composables/useChartAxis";

const props = withDefaults(defineProps<ChartAxisOwnProps>(), {
  grid: undefined,
  hidden: undefined,
});

useChartAxis(props);
</script>

<template>
  <span hidden aria-hidden="true" />
</template>
