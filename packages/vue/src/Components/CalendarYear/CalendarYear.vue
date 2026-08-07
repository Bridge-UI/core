<script setup lang="ts">
// ** Local Imports
import type {
  CalendarYearEmits,
  CalendarYearOwnProps,
} from "@/Components/CalendarYear/calendarYear.types";
import { useCalendarYear } from "@/Components/CalendarYear/composables/useCalendarYear";

defineOptions({ inheritAttrs: false });

const emit = defineEmits<CalendarYearEmits>();

const props = defineProps<CalendarYearOwnProps>();

const { years, rootBind, gridBind, getYearBind } = useCalendarYear(
  props,
  { pageSize: 15, rounded: "md", color: "primary" },
  emit,
);
</script>

<template>
  <div v-bind="rootBind">
    <div v-bind="gridBind">
      <button :key="cell.year" v-for="cell in years" v-bind="getYearBind(cell)">
        {{ cell.label }}
      </button>
    </div>
  </div>
</template>
