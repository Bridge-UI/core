<script setup lang="ts">
// ** Local Imports
import type {
  CalendarDateEmits,
  CalendarDateOwnProps,
} from "@/Components/CalendarDate/calendarDate.types";
import { useCalendarDate } from "@/Components/CalendarDate/composables/useCalendarDate";

defineOptions({ inheritAttrs: false });

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
} = useCalendarDate(props, { startOfWeek: 0, color: "primary" }, emit);

function adapterDayKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}
</script>

<template>
  <div v-bind="rootBind">
    <div role="row" v-if="!hideWeekdays" class="grid grid-cols-7 gap-1">
      <span
        :key="`${label}-${index}`"
        v-bind="getWeekdayBind(label)"
        v-for="(label, index) in weekdays"
      >
        {{ label }}
      </span>
    </div>

    <div v-bind="gridBind">
      <button
        v-for="cell in days"
        v-bind="getDayBind(cell)"
        :key="`${adapterDayKey(cell.date)}-${cell.label}`"
      >
        {{ cell.label }}
      </button>
    </div>
  </div>
</template>
