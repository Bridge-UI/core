<script setup lang="ts">
// ** Local Imports
import { Button } from "@/Components/Button";
import { TimePanel } from "@/Components/TimePanel";
import { useTimeRangePicker } from "@/Components/TimeRangePicker/composables/useTimeRangePicker";
import type {
  TimeRangePickerEmits,
  TimeRangePickerOwnProps,
} from "@/Components/TimeRangePicker/timeRangePicker.types";

defineOptions({ inheritAttrs: false });

const props = defineProps<TimeRangePickerOwnProps>();

const emit = defineEmits<TimeRangePickerEmits>();

const {
  merged,
  endBind,
  rootBind,
  startBind,
  footerBind,
  panelsBind,
  showFooter,
  applyLabel,
  timeTokens,
  handleApply,
  cancelLabel,
  handleCancel,
  endDisplayValue,
  handleEndChange,
  applyButtonProps,
  startDisplayValue,
  cancelButtonProps,
  handleStartChange,
} = useTimeRangePicker(
  props,
  {
    ampm: false,
    interval: 1,
    rounded: "md",
    color: "primary",
    showFooter: false,
  },
  emit,
);
</script>

<template>
  <div v-bind="rootBind">
    <div v-bind="panelsBind">
      <div v-bind="startBind">
        <TimePanel
          :ampm="merged.ampm"
          :tokens="timeTokens"
          :color="merged.color"
          :rounded="merged.rounded"
          :value="startDisplayValue"
          :max-time="merged.maxTime"
          :min-time="merged.minTime"
          :disabled="merged.disabled"
          :interval="merged.interval"
          :read-only="merged.readOnly"
          :time-zone="merged.timeZone"
          v-on:change="handleStartChange"
          :disable-times="merged.disableTimes"
        />
      </div>

      <div v-bind="endBind">
        <TimePanel
          :ampm="merged.ampm"
          :tokens="timeTokens"
          :color="merged.color"
          :value="endDisplayValue"
          :rounded="merged.rounded"
          :max-time="merged.maxTime"
          :min-time="merged.minTime"
          :disabled="merged.disabled"
          :interval="merged.interval"
          :read-only="merged.readOnly"
          :time-zone="merged.timeZone"
          v-on:change="handleEndChange"
          :disable-times="merged.disableTimes"
        />
      </div>
    </div>

    <div v-if="showFooter" v-bind="footerBind">
      <Button
        variant="flat"
        color="secondary"
        v-on:click="handleCancel"
        v-bind="cancelButtonProps"
      >
        {{ cancelLabel }}
      </Button>

      <Button color="primary" v-bind="applyButtonProps" @click="handleApply">
        {{ applyLabel }}
      </Button>
    </div>
  </div>
</template>
