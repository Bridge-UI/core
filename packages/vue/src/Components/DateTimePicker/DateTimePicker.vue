<script setup lang="ts">
// ** External Imports
import { ref } from "vue";

// ** Local Imports
import { ActionFooter } from "@/Components/ActionFooter";
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
import { useOptionalModel } from "@/Utils";

defineSlots<DateTimePickerSlots>();

defineOptions({ inheritAttrs: false });

const model = defineModel<Date | null>();

const emit = defineEmits<DateTimePickerEmits>();

const props = withDefaults(defineProps<DateTimePickerOwnProps>(), {
  showFooter: undefined,
});

const uncontrolledValue = ref<Date | null>(props.defaultValue ?? null);

const value = useOptionalModel(model, uncontrolledValue);

const {
  merged,
  rootBind,
  footerBind,
  showFooter,
  handleApply,
  contentBind,
  displayValue,
  handleCancel,
  calendarBind,
  timeFillBind,
  timeSizerBind,
  timePanelBind,
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
  value,
  emit,
);
</script>

<template>
  <div v-bind="rootBind">
    <div :class="contentBind">
      <div :class="calendarBind">
        <Calendar
          :fill="merged.fill"
          :color="merged.color"
          :error="merged.error"
          :rounded="merged.rounded"
          :max-date="merged.maxDate"
          :min-date="merged.minDate"
          :disabled="merged.disabled"
          :model-value="displayValue"
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
            :fill="merged.fill"
            :color="merged.color"
            :error="merged.error"
            :rounded="merged.rounded"
            :max-time="merged.maxTime"
            :min-time="merged.minTime"
            :disabled="merged.disabled"
            :interval="merged.interval"
            :model-value="displayValue"
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
        <ActionFooter
          v-on:apply="handleApply"
          v-on:cancel="handleCancel"
          :custom-props="{
            applyButton: applyButtonProps,
            cancelButton: cancelButtonProps,
          }"
        />
      </slot>
    </div>
  </div>
</template>
