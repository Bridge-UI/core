<script setup lang="ts">
// ** Local Imports
import { useTimePanel } from "@/Components/TimePanel/composables/useTimePanel";
import type {
  TimePanelEmits,
  TimePanelOwnProps,
} from "@/Components/TimePanel/timePanel.types";

defineOptions({ inheritAttrs: false });

const emit = defineEmits<TimePanelEmits>();

const props = defineProps<TimePanelOwnProps>();

const {
  rootBind,
  hourItems,
  columnBind,
  getHourBind,
  minuteItems,
  showMeridiem,
  getMinuteBind,
  meridiemItems,
  getMeridiemBind,
} = useTimePanel(
  props,
  {
    ampm: false,
    interval: 1,
    rounded: "md",
    color: "primary",
  },
  emit,
);
</script>

<template>
  <div v-bind="rootBind">
    <div v-bind="columnBind">
      <button
        v-for="item in hourItems"
        :key="`hour-${item.value}`"
        v-bind="getHourBind(item)"
      >
        {{ item.label }}
      </button>
    </div>

    <div v-bind="columnBind">
      <button
        v-for="item in minuteItems"
        :key="`minute-${item.value}`"
        v-bind="getMinuteBind(item)"
      >
        {{ item.label }}
      </button>
    </div>

    <div v-if="showMeridiem" v-bind="columnBind">
      <button
        v-for="item in meridiemItems"
        :key="`meridiem-${item.value}`"
        v-bind="getMeridiemBind(item)"
      >
        {{ item.label }}
      </button>
    </div>
  </div>
</template>
