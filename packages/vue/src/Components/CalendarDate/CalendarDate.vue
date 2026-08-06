<script setup lang="ts">
// ** Local Imports
import type {
  CalendarDateEmits,
  CalendarDateOwnProps,
  CalendarDateSlots,
} from "@/Components/CalendarDate/calendarDate.types";
import { useCalendarDate } from "@/Components/CalendarDate/composables/useCalendarDate";

defineOptions({ inheritAttrs: false });

defineSlots<CalendarDateSlots>();

const emit = defineEmits<CalendarDateEmits>();

const props = defineProps<CalendarDateOwnProps>();

const {
  days,
  rootBind,
  gridBind,
  weekdays,
  getDayBind,
  hideWeekdays,
  getWeekdayBind,
} = useCalendarDate(
  props,
  { rounded: "sm", startOfWeek: 0, color: "primary" },
  emit,
);

function adapterDayKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}
</script>

<template>
  <div v-bind="rootBind">
    <div v-bind="gridBind">
      <template v-if="!hideWeekdays">
        <span
          :key="`${label}-${index}`"
          v-bind="getWeekdayBind(label)"
          v-for="(label, index) in weekdays"
        >
          {{ label }}
        </span>
      </template>

      <button
        v-for="cell in days"
        v-bind="getDayBind(cell)"
        :key="`${adapterDayKey(cell.date)}-${cell.label}`"
      >
        <slot name="day" v-bind="cell">{{ cell.label }}</slot>
      </button>
    </div>
  </div>
</template>
