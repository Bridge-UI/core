<script setup lang="ts">
// ** External Imports
import { useTemplateRef } from "vue";

// ** Local Imports
import type { ChartOwnProps, ChartSlots } from "@/Components/Chart/chart.types";
import { useChart } from "@/Components/Chart/composables/useChart";
import { Skeleton } from "@/Components/Skeleton";

defineSlots<ChartSlots>();

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ChartOwnProps>(), {
  loading: false,
  animation: undefined,
});

const rootRef = useTemplateRef<HTMLDivElement>("root");
const plotRef = useTemplateRef<HTMLDivElement>("plot");
const hostRef = useTemplateRef<HTMLDivElement>("host");

const {
  table,
  isEmpty,
  hostBind,
  plotBind,
  rootBind,
  liveBind,
  emptyBind,
  isLoading,
  tableBind,
  loadingBind,
  announcement,
  emptyMessage,
} = useChart(
  props,
  {
    size: "md",
    height: 280,
    animation: true,
  },
  { hostRef, plotRef, rootRef },
);
</script>

<template>
  <div ref="root" v-bind="rootBind">
    <div ref="plot" v-bind="plotBind">
      <div ref="host" v-bind="hostBind" />

      <div v-if="isLoading" v-bind="loadingBind">
        <slot name="loading">
          <Skeleton class="size-full" />
        </slot>
      </div>

      <div v-if="isEmpty" v-bind="emptyBind">
        <slot name="empty">
          {{ emptyMessage }}
        </slot>
      </div>
    </div>

    <slot />

    <table v-bind="tableBind">
      <thead>
        <tr>
          <th scope="col">{{ table.categoryLabel }}</th>
          <th scope="col" :key="item.id" v-for="item in table.series">
            {{ item.name }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr :key="row.category" v-for="row in table.rows">
          <th scope="row">{{ row.category }}</th>
          <td
            v-for="(value, index) in row.values"
            :key="table.series[index]?.id ?? index"
          >
            {{ value }}
          </td>
        </tr>
      </tbody>
    </table>

    <div v-bind="liveBind">{{ announcement }}</div>
  </div>
</template>
