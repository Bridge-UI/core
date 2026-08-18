<script setup lang="ts">
// ** Local Imports
import { Button } from "@/Components/Button";
import { TimePanel } from "@/Components/TimePanel";
import { useTimeRangePicker } from "@/Components/TimeRangePicker/composables/useTimeRangePicker";
import type {
  TimeRangePickerEmits,
  TimeRangePickerOwnProps,
  TimeRangePickerSlots,
} from "@/Components/TimeRangePicker/timeRangePicker.types";

defineOptions({ inheritAttrs: false });

defineSlots<TimeRangePickerSlots>();

const props = withDefaults(defineProps<TimeRangePickerOwnProps>(), {
  showFooter: undefined,
});

const emit = defineEmits<TimeRangePickerEmits>();

const {
  merged,
  endBind,
  rootBind,
  endTitle,
  startBind,
  startTitle,
  footerBind,
  panelsBind,
  showFooter,
  applyLabel,
  handleApply,
  cancelLabel,
  endTitleBind,
  handleCancel,
  startTitleBind,
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
    showSeconds: false,
    orientation: "horizontal",
  },
  emit,
);
</script>

<template>
  <div v-bind="rootBind">
    <div v-bind="panelsBind">
      <div v-bind="startBind">
        <p :class="startTitleBind">{{ startTitle }}</p>

        <TimePanel
          :ampm="merged.ampm"
          :fill="merged.fill"
          :color="merged.color"
          :error="merged.error"
          :rounded="merged.rounded"
          :value="startDisplayValue"
          :max-time="merged.maxTime"
          :min-time="merged.minTime"
          :disabled="merged.disabled"
          :interval="merged.interval"
          :read-only="merged.readOnly"
          :time-zone="merged.timeZone"
          v-on:change="handleStartChange"
          :show-seconds="merged.showSeconds"
          :disable-times="merged.disableTimes"
        />
      </div>

      <div v-bind="endBind">
        <p :class="endTitleBind">{{ endTitle }}</p>

        <TimePanel
          :ampm="merged.ampm"
          :fill="merged.fill"
          :color="merged.color"
          :error="merged.error"
          :value="endDisplayValue"
          :rounded="merged.rounded"
          :max-time="merged.maxTime"
          :min-time="merged.minTime"
          :disabled="merged.disabled"
          :interval="merged.interval"
          :read-only="merged.readOnly"
          :time-zone="merged.timeZone"
          v-on:change="handleEndChange"
          :show-seconds="merged.showSeconds"
          :disable-times="merged.disableTimes"
        />
      </div>
    </div>

    <div v-if="showFooter" v-bind="footerBind">
      <slot name="footer" :apply="handleApply" :cancel="handleCancel">
        <Button
          variant="flat"
          color="secondary"
          v-on:click="handleCancel"
          v-bind="cancelButtonProps"
        >
          {{ cancelLabel }}
        </Button>

        <Button
          color="primary"
          v-bind="applyButtonProps"
          v-on:click="handleApply"
        >
          {{ applyLabel }}
        </Button>
      </slot>
    </div>
  </div>
</template>
