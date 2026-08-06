<script setup lang="ts">
// ** Local Imports
import { Button } from "@/Components/Button";
import CalendarRange from "@/Components/CalendarRange/CalendarRange.vue";
import { useDateRangePicker } from "@/Components/DateRangePicker/composables/useDateRangePicker";
import type {
  DateRangePickerEmits,
  DateRangePickerOwnProps,
  DateRangePickerSlots,
} from "@/Components/DateRangePicker/dateRangePicker.types";

defineOptions({ inheritAttrs: false });

defineSlots<DateRangePickerSlots>();

const props = defineProps<DateRangePickerOwnProps>();

const emit = defineEmits<DateRangePickerEmits>();

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
} = useDateRangePicker(
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
    <CalendarRange
      :color="merged.color"
      :value="displayValue"
      :tokens="calendarTokens"
      :rounded="merged.rounded"
      :max-date="merged.maxDate"
      :min-date="merged.minDate"
      :disabled="merged.disabled"
      :read-only="merged.readOnly"
      :time-zone="merged.timeZone"
      :hide-years="merged.hideYears"
      :hide-months="merged.hideMonths"
      v-on:change="handleCalendarChange"
      :start-of-week="merged.startOfWeek"
      :disable-dates="merged.disableDates"
      :hide-weekdays="merged.hideWeekdays"
      :disable-years="merged.disableYears"
      :disable-months="merged.disableMonths"
    >
      <template #day="cell">
        <slot name="day" v-bind="cell">{{ cell.label }}</slot>
      </template>
    </CalendarRange>

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
