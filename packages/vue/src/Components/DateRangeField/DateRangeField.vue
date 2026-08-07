<script setup lang="ts">
// ** External Imports
import { isUndefined } from "es-toolkit/compat";
import { computed, ref } from "vue";

// ** Core Imports
import type { DateRangeValue } from "@bridge-ui/core";

// ** Local Imports
import { useDateRangeField } from "@/Components/DateRangeField/composables/useDateRangeField";
import type {
  DateRangeFieldEmits,
  DateRangeFieldOwnProps,
  DateRangeFieldSlots,
} from "@/Components/DateRangeField/dateRangeField.types";
import DateRangePicker from "@/Components/DateRangePicker/DateRangePicker.vue";
import { FieldOverlay } from "@/Components/FieldOverlay";
import { FormField } from "@/Components/FormField";

defineSlots<DateRangeFieldSlots>();

defineOptions({ inheritAttrs: false });

const model = defineModel<null | DateRangeValue>();

const props = withDefaults(defineProps<DateRangeFieldOwnProps>(), {
  showErrorIcon: true,
});

const emit = defineEmits<DateRangeFieldEmits>();

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
  dateOnly,
  formField,
  inputBind,
  modelValue,
  handleOpenChange,
  handlePickerChange,
  handlePickerCancel,
  overlayCustomProps,
  dateRangePickerCustomProps,
} = useDateRangeField(props, value, emit);
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
    <DateRangePicker
      :value="modelValue"
      :read-only="props.readonly"
      :max-date="dateOnly.maxDate"
      :min-date="dateOnly.minDate"
      :time-zone="dateOnly.timeZone"
      v-on:change="handlePickerChange"
      v-on:cancel="handlePickerCancel"
      :hide-years="dateOnly.hideYears"
      :show-footer="dateOnly.showFooter"
      :hide-months="dateOnly.hideMonths"
      :orientation="dateOnly.orientation"
      :color="formField.merged.value.color"
      :start-of-week="dateOnly.startOfWeek"
      :disabled="formField.isDisabled.value"
      :disable-dates="dateOnly.disableDates"
      :hide-weekdays="dateOnly.hideWeekdays"
      :disable-years="dateOnly.disableYears"
      :disable-months="dateOnly.disableMonths"
      :rounded="formField.merged.value.rounded"
      :custom-props="dateRangePickerCustomProps"
      :hide-outside-days="dateOnly.hideOutsideDays"
    >
      <template #day="cell">
        <slot name="day" v-bind="cell">{{ cell.label }}</slot>
      </template>
    </DateRangePicker>
  </FieldOverlay>
</template>
