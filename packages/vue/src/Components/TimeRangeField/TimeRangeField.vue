<script setup lang="ts">
// ** External Imports
import { isUndefined } from "es-toolkit/compat";
import { computed, ref } from "vue";

// ** Core Imports
import type { TimeRangeValue } from "@bridge-ui/core";

// ** Local Imports
import { FieldOverlay } from "@/Components/FieldOverlay";
import { FormField } from "@/Components/FormField";
import { useTimeRangeField } from "@/Components/TimeRangeField/composables/useTimeRangeField";
import type {
  TimeRangeFieldEmits,
  TimeRangeFieldOwnProps,
  TimeRangeFieldSlots,
} from "@/Components/TimeRangeField/timeRangeField.types";
import { TimeRangePicker } from "@/Components/TimeRangePicker";

defineSlots<TimeRangeFieldSlots>();

defineOptions({ inheritAttrs: false });

const model = defineModel<null | TimeRangeValue>();

const props = withDefaults(defineProps<TimeRangeFieldOwnProps>(), {
  showErrorIcon: true,
});

const emit = defineEmits<TimeRangeFieldEmits>();

const uncontrolledValue = ref<null | TimeRangeValue>(
  props.defaultValue ?? null,
);

const value = computed({
  set: (next) => {
    model.value = next;
    uncontrolledValue.value = next;
  },
  get: () => {
    return isUndefined(model.value) ? uncontrolledValue.value : model.value;
  },
});

const {
  open,
  overlay,
  timeOnly,
  formField,
  inputBind,
  modelValue,
  pickerClass,
  handleOpenChange,
  handlePickerChange,
  handlePickerCancel,
  overlayCustomProps,
  timeRangePickerCustomProps,
} = useTimeRangeField(props, value, emit);
</script>

<template>
  <FormField :field="formField">
    <input v-bind="inputBind" />
  </FormField>

  <FieldOverlay
    v-model="open"
    :overlay="overlay"
    :custom-props="overlayCustomProps"
    v-on:update:model-value="handleOpenChange"
  >
    <TimeRangePicker
      :value="modelValue"
      :class="pickerClass"
      :ampm="timeOnly.ampm"
      :read-only="props.readonly"
      :max-time="timeOnly.maxTime"
      :min-time="timeOnly.minTime"
      :interval="timeOnly.interval"
      :time-zone="timeOnly.timeZone"
      v-on:change="handlePickerChange"
      v-on:cancel="handlePickerCancel"
      :show-footer="timeOnly.showFooter"
      :color="formField.merged.value.color"
      :disabled="formField.isDisabled.value"
      :disable-times="timeOnly.disableTimes"
      :rounded="formField.merged.value.rounded"
      :custom-props="timeRangePickerCustomProps"
    />
  </FieldOverlay>
</template>
