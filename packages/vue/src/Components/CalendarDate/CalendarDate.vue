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
  hideOutsideDays,
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

      <template
        v-for="cell in days"
        :key="`${adapterDayKey(cell.date)}-${cell.label}`"
      >
        <span
          aria-hidden="true"
          class="h-8 w-full"
          v-if="hideOutsideDays && cell.outside"
        />

        <button v-else v-bind="getDayBind(cell)">
          <slot name="day" v-bind="cell">{{ cell.label }}</slot>
        </button>
      </template>
    </div>
  </div>
</template>
