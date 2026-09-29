<script setup lang="ts">
// ** Local Imports
import type { ChartLegendOwnProps } from "@/Components/ChartLegend/chartLegend.types";
import { useChartLegend } from "@/Components/ChartLegend/composables/useChartLegend";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ChartLegendOwnProps>(), {
  interactive: undefined,
});

const { items, rootBind, labelBind, interactive, getItemBind, getSwatchBind } =
  useChartLegend(props, {
    align: "center",
    interactive: true,
    position: "bottom",
  });
</script>

<template>
  <ul v-bind="rootBind">
    <li :key="item.id" v-for="item in items">
      <button v-if="interactive" v-bind="getItemBind(item)">
        <span v-bind="getSwatchBind(item)" />
        <span v-bind="labelBind">{{ item.name }}</span>
      </button>

      <span v-else v-bind="getItemBind(item)">
        <span v-bind="getSwatchBind(item)" />
        <span v-bind="labelBind">{{ item.name }}</span>
      </span>
    </li>
  </ul>
</template>
