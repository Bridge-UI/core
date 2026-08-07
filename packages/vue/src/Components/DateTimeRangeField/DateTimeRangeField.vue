<script setup lang="ts">
// ** External Imports
import { isUndefined } from "es-toolkit/compat";
import { computed, ref } from "vue";

// ** Core Imports
import type { DateRangeValue } from "@bridge-ui/core";

// ** Local Imports
import { useDateTimeRangeField } from "@/Components/DateTimeRangeField/composables/useDateTimeRangeField";
import type {
  DateTimeRangeFieldEmits,
  DateTimeRangeFieldOwnProps,
  DateTimeRangeFieldSlots,
} from "@/Components/DateTimeRangeField/dateTimeRangeField.types";
import { DateTimeRangePicker } from "@/Components/DateTimeRangePicker";
import { FieldOverlay } from "@/Components/FieldOverlay";
import { FormField } from "@/Components/FormField";

defineSlots<DateTimeRangeFieldSlots>();

defineOptions({ inheritAttrs: false });

const model = defineModel<null | DateRangeValue>();

const props = withDefaults(defineProps<DateTimeRangeFieldOwnProps>(), {
  showErrorIcon: true,
});

const emit = defineEmits<DateTimeRangeFieldEmits>();

const uncontrolledValue = ref<null | DateRangeValue>(
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
  formField,
  inputBind,
  modelValue,
  orientation,
  pickerClass,
  dateTimeOnly,
  handleOpenChange,
  handlePickerChange,
  handlePickerCancel,
  overlayCustomProps,
  dateTimeRangePickerCustomProps,
} = useDateTimeRangeField(props, value, emit);
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
    <DateTimeRangePicker
      :value="modelValue"
      :class="pickerClass"
      :ampm="dateTimeOnly.ampm"
      :orientation="orientation"
      :read-only="props.readonly"
      :max-date="dateTimeOnly.maxDate"
      :min-date="dateTimeOnly.minDate"
      :max-time="dateTimeOnly.maxTime"
      :min-time="dateTimeOnly.minTime"
      v-on:change="handlePickerChange"
      v-on:cancel="handlePickerCancel"
      :interval="dateTimeOnly.interval"
      :time-zone="dateTimeOnly.timeZone"
      :hide-years="dateTimeOnly.hideYears"
      :color="formField.merged.value.color"
      :show-footer="dateTimeOnly.showFooter"
      :hide-months="dateTimeOnly.hideMonths"
      :disabled="formField.isDisabled.value"
      :start-of-week="dateTimeOnly.startOfWeek"
      :rounded="formField.merged.value.rounded"
      :disable-dates="dateTimeOnly.disableDates"
      :hide-weekdays="dateTimeOnly.hideWeekdays"
      :disable-times="dateTimeOnly.disableTimes"
      :disable-years="dateTimeOnly.disableYears"
      :disable-months="dateTimeOnly.disableMonths"
      :custom-props="dateTimeRangePickerCustomProps"
      :hide-outside-days="dateTimeOnly.hideOutsideDays"
    >
      <template #day="cell">
        <slot name="day" v-bind="cell">{{ cell.label }}</slot>
      </template>
    </DateTimeRangePicker>
  </FieldOverlay>
</template>
