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

const props = withDefaults(defineProps<DateRangePickerOwnProps>(), {
  showFooter: undefined,
});

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
    orientation: "horizontal",
  },
  emit,
);
</script>

<template>
  <div v-bind="rootBind">
    <CalendarRange
      :fill="merged.fill"
      :color="merged.color"
      :error="merged.error"
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
      :orientation="merged.orientation"
      v-on:change="handleCalendarChange"
      :start-of-week="merged.startOfWeek"
      :disable-dates="merged.disableDates"
      :hide-weekdays="merged.hideWeekdays"
      :disable-years="merged.disableYears"
      :disable-months="merged.disableMonths"
      :hide-outside-days="merged.hideOutsideDays"
    >
      <template #day="cell">
        <slot name="day" v-bind="cell">{{ cell.label }}</slot>
      </template>
    </CalendarRange>

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

        <Button
          color="primary"
          v-bind="applyButtonProps"
          v-on:click="handleApply"
        >
          {{ applyLabel }}
        </Button>
      </slot>
    </div>
  </div>
</template>
