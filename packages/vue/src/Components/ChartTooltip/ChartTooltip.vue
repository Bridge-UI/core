<script setup lang="ts">
// ** External Imports
import { useTemplateRef } from "vue";

// ** Local Imports
import type {
  ChartTooltipOwnProps,
  ChartTooltipSlots,
} from "@/Components/ChartTooltip/chartTooltip.types";
import { useChartTooltip } from "@/Components/ChartTooltip/composables/useChartTooltip";

defineSlots<ChartTooltipSlots>();

defineOptions({ inheritAttrs: false });

const props = defineProps<ChartTooltipOwnProps>();

const tooltipRef = useTemplateRef<HTMLDivElement>("tooltip");

const {
  isOpen,
  context,
  itemBind,
  rootBind,
  labelBind,
  titleBind,
  valueBind,
  percentBind,
  formatValue,
  formatPercent,
  getSwatchBind,
} = useChartTooltip(props, tooltipRef);
</script>

<template>
  <div ref="tooltip" v-bind="rootBind" v-if="isOpen && context">
    <slot name="content" v-bind="context">
      <div v-bind="titleBind" v-if="context.title">
        <span v-if="context.color" v-bind="getSwatchBind(context.color)" />
        {{ context.title }}
      </div>

      <div :key="item.id" v-bind="itemBind" v-for="item in context.items">
        <span v-if="item.color" v-bind="getSwatchBind(item.color)" />
        <span v-bind="labelBind">{{ item.name }}</span>
        <span v-bind="valueBind">{{ formatValue(item) }}</span>
        <span v-bind="percentBind" v-if="formatPercent(item) !== null">
          {{ formatPercent(item) }}
        </span>
      </div>
    </slot>
  </div>
</template>
