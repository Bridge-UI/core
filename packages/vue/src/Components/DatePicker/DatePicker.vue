<script setup lang="ts">
// ** Local Imports
import { Button } from "@/Components/Button";
import Calendar from "@/Components/Calendar/Calendar.vue";
import { useDatePicker } from "@/Components/DatePicker/composables/useDatePicker";
import type {
  DatePickerEmits,
  DatePickerOwnProps,
  DatePickerSlots,
} from "@/Components/DatePicker/datePicker.types";

defineOptions({ inheritAttrs: false });

defineSlots<DatePickerSlots>();

const props = defineProps<DatePickerOwnProps>();

const emit = defineEmits<DatePickerEmits>();

const {
  merged,
  rootBind,
  footerBind,
  showFooter,
  applyLabel,
  handleApply,
  cancelLabel,
  displayValue,
  handleCancel,
  calendarTokens,
  applyButtonProps,
  cancelButtonProps,
  handleCalendarChange,
} = useDatePicker(
  props,
  {
    rounded: "md",
    startOfWeek: 0,
    color: "primary",
    showFooter: false,
  },
  emit,
);
</script>

<template>
  <div v-bind="rootBind">
    <Calendar
      :color="merged.color"
      :range="merged.range"
      :value="displayValue"
      :tokens="calendarTokens"
      :rounded="merged.rounded"
      :max-date="merged.maxDate"
      :min-date="merged.minDate"
      :disabled="merged.disabled"
      :multiple="merged.multiple"
      :read-only="merged.readOnly"
      :time-zone="merged.timeZone"
      :hide-years="merged.hideYears"
      :hide-months="merged.hideMonths"
      v-on:change="handleCalendarChange"
      :default-view="merged.defaultView"
      :start-of-week="merged.startOfWeek"
      :disable-dates="merged.disableDates"
      :hide-weekdays="merged.hideWeekdays"
      :disable-years="merged.disableYears"
      :disable-months="merged.disableMonths"
    >
      <template #day="cell">
        <slot name="day" v-bind="cell">{{ cell.label }}</slot>
      </template>
    </Calendar>

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
