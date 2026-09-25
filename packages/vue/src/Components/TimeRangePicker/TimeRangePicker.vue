<script setup lang="ts">
// ** External Imports
import { ref } from "vue";

// ** Core Imports
import type { TimeRangeValue } from "@bridge-ui/core/Domain";

// ** Local Imports
import { ActionFooter } from "@/Components/ActionFooter";
import { Divider } from "@/Components/Divider";
import { TimePanel } from "@/Components/TimePanel";
import { useTimeRangePicker } from "@/Components/TimeRangePicker/composables/useTimeRangePicker";
import type {
  TimeRangePickerEmits,
  TimeRangePickerOwnProps,
  TimeRangePickerSlots,
} from "@/Components/TimeRangePicker/timeRangePicker.types";
import { useOptionalModel } from "@/Utils";

defineSlots<TimeRangePickerSlots>();

defineOptions({ inheritAttrs: false });

const emit = defineEmits<TimeRangePickerEmits>();

const model = defineModel<null | TimeRangeValue>();

const props = withDefaults(defineProps<TimeRangePickerOwnProps>(), {
  showFooter: undefined,
});

const uncontrolledValue = ref<null | TimeRangeValue>(
  props.defaultValue ?? null,
);

const value = useOptionalModel(model, uncontrolledValue);

const {
  merged,
  endBind,
  rootBind,
  endTitle,
  startBind,
  startTitle,
  footerBind,
  titlesBind,
  panelsBind,
  showFooter,
  handleApply,
  titleGapBind,
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
  },
  value,
  emit,
);
</script>

<template>
  <div v-bind="rootBind">
    <div :class="titlesBind">
      <p :class="startTitleBind">{{ startTitle }}</p>
      <span aria-hidden="true" :class="titleGapBind" />
      <p :class="endTitleBind">{{ endTitle }}</p>
    </div>

    <div v-bind="panelsBind">
      <div v-bind="startBind">
        <TimePanel
          :ampm="merged.ampm"
          :fill="merged.fill"
          :color="merged.color"
          :error="merged.error"
          :rounded="merged.rounded"
          :max-time="merged.maxTime"
          :min-time="merged.minTime"
          :disabled="merged.disabled"
          :interval="merged.interval"
          :read-only="merged.readOnly"
          :time-zone="merged.timeZone"
          v-on:change="handleStartChange"
          :model-value="startDisplayValue"
          :show-seconds="merged.showSeconds"
          :disable-times="merged.disableTimes"
        />
      </div>

      <Divider orientation="vertical" />

      <div v-bind="endBind">
        <TimePanel
          :ampm="merged.ampm"
          :fill="merged.fill"
          :color="merged.color"
          :error="merged.error"
          :rounded="merged.rounded"
          :max-time="merged.maxTime"
          :min-time="merged.minTime"
          :disabled="merged.disabled"
          :interval="merged.interval"
          :read-only="merged.readOnly"
          :time-zone="merged.timeZone"
          v-on:change="handleEndChange"
          :model-value="endDisplayValue"
          :show-seconds="merged.showSeconds"
          :disable-times="merged.disableTimes"
        />
      </div>
    </div>

    <div v-if="showFooter" v-bind="footerBind">
      <slot name="footer" :apply="handleApply" :cancel="handleCancel">
        <ActionFooter
          v-on:apply="handleApply"
          v-on:cancel="handleCancel"
          :custom-props="{
            applyButton: applyButtonProps,
            cancelButton: cancelButtonProps,
          }"
        />
      </slot>
    </div>
  </div>
</template>
