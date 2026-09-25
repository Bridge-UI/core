<script setup lang="ts">
// ** External Imports
import { ref } from "vue";

// ** Core Imports
import type { DateRangeValue } from "@bridge-ui/core/Domain";

// ** Local Imports
import { ActionFooter } from "@/Components/ActionFooter";
import CalendarRange from "@/Components/CalendarRange/CalendarRange.vue";
import { useDateRangePicker } from "@/Components/DateRangePicker/composables/useDateRangePicker";
import type {
  DateRangePickerEmits,
  DateRangePickerOwnProps,
  DateRangePickerSlots,
} from "@/Components/DateRangePicker/dateRangePicker.types";
import { useOptionalModel } from "@/Utils";

defineSlots<DateRangePickerSlots>();

defineOptions({ inheritAttrs: false });

const emit = defineEmits<DateRangePickerEmits>();

const model = defineModel<null | DateRangeValue>();

const props = withDefaults(defineProps<DateRangePickerOwnProps>(), {
  showFooter: undefined,
});

const uncontrolledValue = ref<null | DateRangeValue>(
  props.defaultValue ?? null,
);

const value = useOptionalModel(model, uncontrolledValue);

const {
  merged,
  rootBind,
  footerBind,
  showFooter,
  handleApply,
  displayValue,
  handleCancel,
  applyButtonProps,
  cancelButtonProps,
  handleCalendarChange,
} = useDateRangePicker(
  props,
  {
    rounded: "md",
    startOfWeek: 0,
    color: "primary",
    orientation: "horizontal",
  },
  value,
  emit,
);
</script>

<template>
  <div v-bind="rootBind">
    <CalendarRange
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
      :granularity="merged.granularity"
      :orientation="merged.orientation"
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
    </CalendarRange>

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
