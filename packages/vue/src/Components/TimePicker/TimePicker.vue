<script setup lang="ts">
// ** External Imports
import { ref } from "vue";

// ** Core Imports
import type { TimeValue } from "@bridge-ui/core/Domain";

// ** Local Imports
import { ActionFooter } from "@/Components/ActionFooter";
import { TimePanel } from "@/Components/TimePanel";
import { useTimePicker } from "@/Components/TimePicker/composables/useTimePicker";
import type {
  TimePickerEmits,
  TimePickerOwnProps,
  TimePickerSlots,
} from "@/Components/TimePicker/timePicker.types";
import { useOptionalModel } from "@/Utils";

defineSlots<TimePickerSlots>();

defineOptions({ inheritAttrs: false });

const emit = defineEmits<TimePickerEmits>();

const model = defineModel<null | TimeValue>();

const props = withDefaults(defineProps<TimePickerOwnProps>(), {
  showFooter: undefined,
});

const uncontrolledValue = ref<null | TimeValue>(props.defaultValue ?? null);

const value = useOptionalModel(model, uncontrolledValue);

const {
  merged,
  rootBind,
  footerBind,
  showFooter,
  contentBind,
  handleApply,
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
  value,
  emit,
);
</script>

<template>
  <div v-bind="rootBind">
    <div :class="contentBind">
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
        :model-value="displayValue"
        :read-only="merged.readOnly"
        :time-zone="merged.timeZone"
        v-on:change="handlePanelChange"
        :show-seconds="merged.showSeconds"
        :disable-times="merged.disableTimes"
      />
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
