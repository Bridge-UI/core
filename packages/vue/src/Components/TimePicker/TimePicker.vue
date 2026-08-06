<script setup lang="ts">
// ** Local Imports
import { Button } from "@/Components/Button";
import { TimePanel } from "@/Components/TimePanel";
import { useTimePicker } from "@/Components/TimePicker/composables/useTimePicker";
import type {
  TimePickerEmits,
  TimePickerOwnProps,
} from "@/Components/TimePicker/timePicker.types";

defineOptions({ inheritAttrs: false });

const props = defineProps<TimePickerOwnProps>();

const emit = defineEmits<TimePickerEmits>();

const {
  merged,
  rootBind,
  footerBind,
  showFooter,
  applyLabel,
  timeTokens,
  handleApply,
  cancelLabel,
  displayValue,
  handleCancel,
  applyButtonProps,
  cancelButtonProps,
  handlePanelChange,
} = useTimePicker(
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
    <TimePanel
      :ampm="merged.ampm"
      :tokens="timeTokens"
      :color="merged.color"
      :value="displayValue"
      :rounded="merged.rounded"
      :max-time="merged.maxTime"
      :min-time="merged.minTime"
      :disabled="merged.disabled"
      :interval="merged.interval"
      :read-only="merged.readOnly"
      :time-zone="merged.timeZone"
      v-on:change="handlePanelChange"
      :disable-times="merged.disableTimes"
    />

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
