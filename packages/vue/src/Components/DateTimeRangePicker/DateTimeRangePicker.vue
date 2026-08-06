<script setup lang="ts">
// ** Local Imports
import { Button } from "@/Components/Button";
import CalendarRange from "@/Components/CalendarRange/CalendarRange.vue";
import { useDateTimeRangePicker } from "@/Components/DateTimeRangePicker/composables/useDateTimeRangePicker";
import type {
  DateTimeRangePickerEmits,
  DateTimeRangePickerOwnProps,
  DateTimeRangePickerSlots,
} from "@/Components/DateTimeRangePicker/dateTimeRangePicker.types";
import { TimePanel } from "@/Components/TimePanel";

defineOptions({ inheritAttrs: false });

defineSlots<DateTimeRangePickerSlots>();

const props = defineProps<DateTimeRangePickerOwnProps>();

const emit = defineEmits<DateTimeRangePickerEmits>();

const {
  merged,
  rootBind,
  timeBind,
  footerBind,
  showFooter,
  applyLabel,
  timeTokens,
  handleApply,
  cancelLabel,
  contentBind,
  displayValue,
  handleCancel,
  calendarBind,
  endTimeValue,
  calendarTokens,
  startTimeValue,
  applyButtonProps,
  cancelButtonProps,
  handleCalendarChange,
  handleEndPanelChange,
  handleStartPanelChange,
} = useDateTimeRangePicker(
  props,
  {
    ampm: false,
    interval: 1,
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
    <div :class="contentBind">
      <div :class="calendarBind">
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
      </div>

      <div :class="timeBind">
        <div class="flex flex-1 flex-col">
          <TimePanel
            :ampm="merged.ampm"
            :tokens="timeTokens"
            :color="merged.color"
            :value="startTimeValue"
            :rounded="merged.rounded"
            :max-time="merged.maxTime"
            :min-time="merged.minTime"
            :disabled="merged.disabled"
            :interval="merged.interval"
            :read-only="merged.readOnly"
            :time-zone="merged.timeZone"
            v-on:change="handleStartPanelChange"
            :disable-times="merged.disableTimes"
          />
        </div>

        <div
          class="flex flex-1 flex-col border-l border-gray-100 dark:border-gray-800"
        >
          <TimePanel
            :ampm="merged.ampm"
            :tokens="timeTokens"
            :color="merged.color"
            :value="endTimeValue"
            :rounded="merged.rounded"
            :max-time="merged.maxTime"
            :min-time="merged.minTime"
            :disabled="merged.disabled"
            :interval="merged.interval"
            :read-only="merged.readOnly"
            :time-zone="merged.timeZone"
            v-on:change="handleEndPanelChange"
            :disable-times="merged.disableTimes"
          />
        </div>
      </div>
    </div>

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
