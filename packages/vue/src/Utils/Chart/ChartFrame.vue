<script setup lang="ts">
// ** Local Imports
import type { ChartFrameState } from "@/Utils/Chart/useChartRoot";
import LoadingSpin from "@/Utils/LoadingSpin.vue";

const props = defineProps<{
  frame: ChartFrameState;
  showCenter?: boolean;
}>();

// The frame object is created once per root, so destructuring keeps refs.
const {
  table,
  isEmpty,
  rootRef,
  plotRef,
  hostRef,
  hostBind,
  plotBind,
  rootBind,
  liveBind,
  emptyBind,
  isLoading,
  tableBind,
  centerBind,
  loadingBind,
  announcement,
  emptyMessage,
} = props.frame;

function setRoot(element: unknown) {
  rootRef.value = element as null | HTMLDivElement;
}

function setPlot(element: unknown) {
  plotRef.value = element as null | HTMLDivElement;
}

function setHost(element: unknown) {
  hostRef.value = element as null | HTMLDivElement;
}
</script>

<template>
  <div :ref="setRoot" v-bind="rootBind">
    <div :ref="setPlot" v-bind="plotBind">
      <div :ref="setHost" v-bind="hostBind" />

      <div v-bind="centerBind" v-if="showCenter && !isEmpty">
        <slot name="center" />
      </div>

      <div v-if="isLoading" v-bind="loadingBind">
        <slot name="loading">
          <LoadingSpin />
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
          <th
            scope="col"
            :key="`${index}-${header}`"
            v-for="(header, index) in table.headers"
          >
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr :key="row.key" v-for="row in table.rows">
          <template :key="index" v-for="(cell, index) in row.cells">
            <th scope="row" v-if="index === 0">{{ cell }}</th>
            <td v-else>{{ cell }}</td>
          </template>
        </tr>
      </tbody>
    </table>

    <div v-bind="liveBind">{{ announcement }}</div>
  </div>
</template>
