<script setup lang="ts">
// ** Local Imports
import type {
  CalendarMonthEmits,
  CalendarMonthOwnProps,
} from "@/Components/CalendarMonth/calendarMonth.types";
import { useCalendarMonth } from "@/Components/CalendarMonth/composables/useCalendarMonth";

defineOptions({ inheritAttrs: false });

const props = defineProps<CalendarMonthOwnProps>();

const emit = defineEmits<CalendarMonthEmits>();

const { months, rootBind, gridBind, getMonthBind } = useCalendarMonth(
  props,
  { color: "primary" },
  emit,
);
</script>

<template>
  <div v-bind="rootBind">
    <div v-bind="gridBind">
      <button
        :key="cell.month"
        v-for="cell in months"
        v-bind="getMonthBind(cell)"
      >
        {{ cell.label }}
      </button>
    </div>
  </div>
</template>
