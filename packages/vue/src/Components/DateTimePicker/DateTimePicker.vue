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
import {
  TIME_PANEL_COLUMN_WIDTH_CLASS,
  TimePanel,
} from "@/Components/TimePanel";

defineOptions({ inheritAttrs: false });

defineSlots<DateTimePickerSlots>();

const props = withDefaults(defineProps<DateTimePickerOwnProps>(), {
  showFooter: undefined,
});

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
  contentBind,
  displayValue,
  handleCancel,
  calendarBind,
  timeFillBind,
  timeSizerBind,
  timePanelBind,
  calendarTokens,
  applyButtonProps,
  cancelButtonProps,
  handlePanelChange,
  handleCalendarChange,
  timePanelCustomProps,
} = useDateTimePicker(
  props,
  {
    ampm: false,
    interval: 1,
    rounded: "md",
    startOfWeek: 0,
    color: "primary",
    showSeconds: false,
    defaultView: "date",
  },
  emit,
);
</script>

<template>
  <div v-bind="rootBind">
    <div :class="contentBind">
      <div :class="calendarBind">
        <Calendar
          :color="merged.color"
          :value="displayValue"
          :error="merged.error"
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
          :hide-outside-days="merged.hideOutsideDays"
        >
          <template #day="cell">
            <slot name="day" v-bind="cell">{{ cell.label }}</slot>
          </template>
        </Calendar>
      </div>

      <div :class="timePanelBind">
        <div aria-hidden="true" :class="timeSizerBind">
          <div :class="TIME_PANEL_COLUMN_WIDTH_CLASS" />
          <div :class="TIME_PANEL_COLUMN_WIDTH_CLASS" />
          <div
            v-if="merged.showSeconds"
            :class="TIME_PANEL_COLUMN_WIDTH_CLASS"
          />
          <div v-if="merged.ampm" :class="TIME_PANEL_COLUMN_WIDTH_CLASS" />
        </div>

        <div :class="timeFillBind">
          <TimePanel
            :ampm="merged.ampm"
            :tokens="timeTokens"
            :color="merged.color"
            :value="displayValue"
            :error="merged.error"
            :rounded="merged.rounded"
            :max-time="merged.maxTime"
            :min-time="merged.minTime"
            :disabled="merged.disabled"
            :interval="merged.interval"
            :read-only="merged.readOnly"
            :time-zone="merged.timeZone"
            v-on:change="handlePanelChange"
            :show-seconds="merged.showSeconds"
            :disable-times="merged.disableTimes"
            :custom-props="timePanelCustomProps"
          />
        </div>
      </div>
    </div>

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
