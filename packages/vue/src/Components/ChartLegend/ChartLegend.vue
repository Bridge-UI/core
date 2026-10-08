<script setup lang="ts">
// ** Local Imports
import type { ChartLegendOwnProps } from "@/Components/ChartLegend/chartLegend.types";
import { useChartLegend } from "@/Components/ChartLegend/composables/useChartLegend";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ChartLegendOwnProps>(), {
  showValue: undefined,
  interactive: undefined,
  showPercent: undefined,
});

const {
  items,
  rootBind,
  getValue,
  labelBind,
  valueBind,
  getPercent,
  interactive,
  percentBind,
  getItemBind,
  getSwatchBind,
} = useChartLegend(props, {
  align: "center",
  showValue: false,
  interactive: true,
  showPercent: false,
  position: "bottom",
});
</script>

<template>
  <ul v-bind="rootBind">
    <li :key="item.id" v-for="item in items">
      <component
        v-bind="getItemBind(item)"
        :is="interactive ? 'button' : 'span'"
      >
        <span v-bind="getSwatchBind(item)" />
        <span v-bind="labelBind">{{ item.name }}</span>
        <span v-bind="valueBind" v-if="getValue(item) !== null">
          {{ getValue(item) }}
        </span>
        <span v-bind="percentBind" v-if="getPercent(item) !== null">
          {{ getPercent(item) }}
        </span>
      </component>
    </li>
  </ul>
</template>
