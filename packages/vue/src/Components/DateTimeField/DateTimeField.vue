<script setup lang="ts">
// ** External Imports
import { isUndefined } from "es-toolkit/compat";
import { computed, ref } from "vue";

// ** Local Imports
import { useDateTimeField } from "@/Components/DateTimeField/composables/useDateTimeField";
import type {
  DateTimeFieldEmits,
  DateTimeFieldOwnProps,
  DateTimeFieldSlots,
} from "@/Components/DateTimeField/dateTimeField.types";
import { DateTimePicker } from "@/Components/DateTimePicker";
import { FieldOverlay } from "@/Components/FieldOverlay";
import { FormField } from "@/Components/FormField";

defineSlots<DateTimeFieldSlots>();

defineOptions({ inheritAttrs: false });

const model = defineModel<Date | null>();

const props = withDefaults(defineProps<DateTimeFieldOwnProps>(), {
  showErrorIcon: true,
});

const emit = defineEmits<DateTimeFieldEmits>();

const uncontrolledValue = ref<Date | null>(props.defaultValue ?? null);

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
  dateTimeOnly,
  handleOpenChange,
  handlePickerChange,
  handlePickerCancel,
  overlayCustomProps,
  dateTimePickerCustomProps,
} = useDateTimeField(props, value, emit);
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
    <DateTimePicker
      :value="modelValue"
      :ampm="dateTimeOnly.ampm"
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
      :default-view="dateTimeOnly.defaultView"
      :start-of-week="dateTimeOnly.startOfWeek"
      :custom-props="dateTimePickerCustomProps"
      :rounded="formField.merged.value.rounded"
      :disable-dates="dateTimeOnly.disableDates"
      :hide-weekdays="dateTimeOnly.hideWeekdays"
      :disable-times="dateTimeOnly.disableTimes"
      :disable-years="dateTimeOnly.disableYears"
      :disable-months="dateTimeOnly.disableMonths"
      :hide-outside-days="dateTimeOnly.hideOutsideDays"
    >
      <template #day="cell">
        <slot name="day" v-bind="cell">{{ cell.label }}</slot>
      </template>
    </DateTimePicker>
  </FieldOverlay>
</template>
