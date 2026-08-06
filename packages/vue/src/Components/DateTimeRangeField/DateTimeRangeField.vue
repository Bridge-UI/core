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
import { FormField } from "@/Components/FormField";
import { Menu } from "@/Components/Menu";

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
  formField,
  inputBind,
  menuProps,
  modelValue,
  dateTimeOnly,
  containerRef,
  handleOpenChange,
  handlePickerChange,
  dateTimeRangePickerCustomProps,
} = useDateTimeRangeField(props, value, emit);
</script>

<template>
  <FormField :field="formField">
    <input v-bind="inputBind" />
  </FormField>

  <Menu
    v-model="open"
    close-on-click-away
    placement="bottom-start"
    :anchor-el="containerRef"
    v-bind="menuProps"
    v-on:update:model-value="handleOpenChange"
  >
    <DateTimeRangePicker
      :value="modelValue"
      :ampm="dateTimeOnly.ampm"
      :read-only="props.readonly"
      :max-date="dateTimeOnly.maxDate"
      :min-date="dateTimeOnly.minDate"
      :max-time="dateTimeOnly.maxTime"
      :min-time="dateTimeOnly.minTime"
      v-on:change="handlePickerChange"
      :interval="dateTimeOnly.interval"
      :time-zone="dateTimeOnly.timeZone"
      :hide-years="dateTimeOnly.hideYears"
      :color="formField.merged.value.color"
      :show-footer="dateTimeOnly.showFooter"
      :hide-months="dateTimeOnly.hideMonths"
      :disabled="formField.isDisabled.value"
      :orientation="dateTimeOnly.orientation"
      :start-of-week="dateTimeOnly.startOfWeek"
      :rounded="formField.merged.value.rounded"
      :disable-dates="dateTimeOnly.disableDates"
      :hide-weekdays="dateTimeOnly.hideWeekdays"
      :disable-times="dateTimeOnly.disableTimes"
      :disable-years="dateTimeOnly.disableYears"
      :disable-months="dateTimeOnly.disableMonths"
      :custom-props="dateTimeRangePickerCustomProps"
    >
      <template #day="cell">
        <slot name="day" v-bind="cell">{{ cell.label }}</slot>
      </template>
    </DateTimeRangePicker>
  </Menu>
</template>
