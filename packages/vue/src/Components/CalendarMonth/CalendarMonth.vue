<script setup lang="ts">
// ** External Imports
import { ref } from "vue";

// ** Local Imports
import type {
  CalendarMonthEmits,
  CalendarMonthOwnProps,
} from "@/Components/CalendarMonth/calendarMonth.types";
import { useCalendarMonth } from "@/Components/CalendarMonth/composables/useCalendarMonth";
import { useOptionalModel } from "@/Utils";

const model = defineModel<number>();

defineOptions({ inheritAttrs: false });

const emit = defineEmits<CalendarMonthEmits>();

const props = defineProps<CalendarMonthOwnProps>();

const uncontrolledValue = ref<number | undefined>(undefined);

const value = useOptionalModel(model, uncontrolledValue);

const { months, rootBind, gridBind, getMonthBind } = useCalendarMonth(
  props,
  { rounded: "md", color: "primary" },
  value,
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
