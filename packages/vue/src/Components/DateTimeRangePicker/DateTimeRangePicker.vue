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
import {
  TIME_PANEL_COLUMN_WIDTH_CLASS,
  TimePanel,
} from "@/Components/TimePanel";

defineOptions({ inheritAttrs: false });

defineSlots<DateTimeRangePickerSlots>();

const props = withDefaults(defineProps<DateTimeRangePickerOwnProps>(), {
  showFooter: undefined,
});

const emit = defineEmits<DateTimeRangePickerEmits>();

const {
  merged,
  rootBind,
  timeBind,
  footerBind,
  showFooter,
  applyLabel,
  handleApply,
  cancelLabel,
  contentBind,
  displayValue,
  handleCancel,
  calendarBind,
  timeFillBind,
  endTimeValue,
  timeSizerBind,
  startTimeValue,
  applyButtonProps,
  cancelButtonProps,
  handleCalendarChange,
  handleEndPanelChange,
  timePanelCustomProps,
  handleStartPanelChange,
} = useDateTimeRangePicker(
  props,
  {
    ampm: false,
    interval: 1,
    rounded: "md",
    startOfWeek: 0,
    color: "primary",
    showSeconds: false,
    orientation: "horizontal",
  },
  emit,
);
</script>

<template>
  <div v-bind="rootBind">
    <div :class="contentBind">
      <div :class="calendarBind">
        <CalendarRange
          :fill="merged.fill"
          :color="merged.color"
          :error="merged.error"
          :value="displayValue"
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
          :custom-props="{
            end: { class: 'pr-2.5' },
            start: { class: 'pr-2.5' },
            panels: { class: 'gap-0' },
          }"
        >
          <template #day="cell">
            <slot name="day" v-bind="cell">{{ cell.label }}</slot>
          </template>

          <template #startAside>
            <div :class="timeBind">
              <div aria-hidden="true" :class="timeSizerBind">
                <div :class="TIME_PANEL_COLUMN_WIDTH_CLASS" />
                <div :class="TIME_PANEL_COLUMN_WIDTH_CLASS" />
                <div
                  v-if="merged.showSeconds"
                  :class="TIME_PANEL_COLUMN_WIDTH_CLASS"
                />
                <div
                  v-if="merged.ampm"
                  :class="TIME_PANEL_COLUMN_WIDTH_CLASS"
                />
              </div>

              <div :class="timeFillBind">
                <TimePanel
                  :ampm="merged.ampm"
                  :fill="merged.fill"
                  :color="merged.color"
                  :error="merged.error"
                  :value="startTimeValue"
                  :rounded="merged.rounded"
                  :max-time="merged.maxTime"
                  :min-time="merged.minTime"
                  :disabled="merged.disabled"
                  :interval="merged.interval"
                  :read-only="merged.readOnly"
                  :time-zone="merged.timeZone"
                  :show-seconds="merged.showSeconds"
                  v-on:change="handleStartPanelChange"
                  :disable-times="merged.disableTimes"
                  :custom-props="timePanelCustomProps"
                />
              </div>
            </div>
          </template>

          <template #endAside>
            <div :class="timeBind">
              <div aria-hidden="true" :class="timeSizerBind">
                <div :class="TIME_PANEL_COLUMN_WIDTH_CLASS" />
                <div :class="TIME_PANEL_COLUMN_WIDTH_CLASS" />
                <div
                  v-if="merged.showSeconds"
                  :class="TIME_PANEL_COLUMN_WIDTH_CLASS"
                />
                <div
                  v-if="merged.ampm"
                  :class="TIME_PANEL_COLUMN_WIDTH_CLASS"
                />
              </div>

              <div :class="timeFillBind">
                <TimePanel
                  :ampm="merged.ampm"
                  :fill="merged.fill"
                  :color="merged.color"
                  :value="endTimeValue"
                  :error="merged.error"
                  :rounded="merged.rounded"
                  :max-time="merged.maxTime"
                  :min-time="merged.minTime"
                  :disabled="merged.disabled"
                  :interval="merged.interval"
                  :read-only="merged.readOnly"
                  :time-zone="merged.timeZone"
                  :show-seconds="merged.showSeconds"
                  v-on:change="handleEndPanelChange"
                  :disable-times="merged.disableTimes"
                  :custom-props="timePanelCustomProps"
                />
              </div>
            </div>
          </template>
        </CalendarRange>
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
