<script setup lang="ts">
// ** Local Imports
import { Button } from "@/Components/Button";
import { TimePanel } from "@/Components/TimePanel";
import { useTimePicker } from "@/Components/TimePicker/composables/useTimePicker";
import type {
  TimePickerEmits,
  TimePickerOwnProps,
  TimePickerSlots,
} from "@/Components/TimePicker/timePicker.types";

defineOptions({ inheritAttrs: false });

defineSlots<TimePickerSlots>();

const props = withDefaults(defineProps<TimePickerOwnProps>(), {
  showFooter: undefined,
});

const emit = defineEmits<TimePickerEmits>();

const {
  merged,
  rootBind,
  footerBind,
  showFooter,
  applyLabel,
  timeTokens,
  contentBind,
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
    showSeconds: false,
  },
  emit,
);
</script>

<template>
  <div v-bind="rootBind">
    <div :class="contentBind">
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
        :show-seconds="merged.showSeconds"
        :disable-times="merged.disableTimes"
      />
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

        <Button color="primary" v-bind="applyButtonProps" @click="handleApply">
          {{ applyLabel }}
        </Button>
      </slot>
    </div>
  </div>
</template>
