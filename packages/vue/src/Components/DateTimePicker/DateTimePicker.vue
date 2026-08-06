<script setup lang="ts">
// ** Local Imports
import { Button } from "@/Components/Button";
import Calendar from "@/Components/Calendar/Calendar.vue";
import { useDateTimePicker } from "@/Components/DateTimePicker/composables/useDateTimePicker";
import type {
  DateTimePickerEmits,
  DateTimePickerOwnProps,
  DateTimePickerSlots,
} from "@/Components/DateTimePicker/dateTimePicker.types";
import { TimePanel } from "@/Components/TimePanel";

defineOptions({ inheritAttrs: false });

defineSlots<DateTimePickerSlots>();

const props = defineProps<DateTimePickerOwnProps>();

const emit = defineEmits<DateTimePickerEmits>();

const {
  merged,
  rootBind,
  footerBind,
  showFooter,
  applyLabel,
  timeTokens,
  handleApply,
  cancelLabel,
  displayValue,
  handleCancel,
  timePanelBind,
  calendarTokens,
  applyButtonProps,
  cancelButtonProps,
  handlePanelChange,
  handleCalendarChange,
} = useDateTimePicker(
  props,
  {
    ampm: false,
    interval: 1,
    rounded: "md",
    startOfWeek: 0,
    color: "primary",
    showFooter: false,
    defaultView: "date",
  },
  emit,
);
</script>

<template>
  <div v-bind="rootBind">
    <Calendar
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

    <div :class="timePanelBind">
      <TimePanel
        :ampm="merged.ampm"
        :tokens="timeTokens"
        :color="merged.color"
        :value="displayValue"
        :rounded="merged.rounded"
        :max-time="merged.maxTime"
        :min-time="merged.minTime"
        :disabled="merged.disabled"
        :interval="merged.interval"
        :read-only="merged.readOnly"
        :time-zone="merged.timeZone"
        v-on:change="handlePanelChange"
        :disable-times="merged.disableTimes"
      />
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
