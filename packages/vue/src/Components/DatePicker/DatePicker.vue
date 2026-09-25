<script setup lang="ts">
// ** External Imports
import { ref } from "vue";

// ** Core Imports
import type { DatePickerModel } from "@bridge-ui/core/Domain";

// ** Local Imports
import { ActionFooter } from "@/Components/ActionFooter";
import Calendar from "@/Components/Calendar/Calendar.vue";
import { useDatePicker } from "@/Components/DatePicker/composables/useDatePicker";
import type {
  DatePickerEmits,
  DatePickerOwnProps,
  DatePickerSlots,
} from "@/Components/DatePicker/datePicker.types";
import { useOptionalModel } from "@/Utils";

defineSlots<DatePickerSlots>();

defineOptions({ inheritAttrs: false });

const emit = defineEmits<DatePickerEmits>();

const model = defineModel<DatePickerModel>();

const props = withDefaults(defineProps<DatePickerOwnProps>(), {
  showFooter: undefined,
});

const uncontrolledValue = ref<DatePickerModel>(props.defaultValue ?? null);

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
} = useDatePicker(
  props,
  {
    rounded: "md",
    startOfWeek: 0,
    color: "primary",
  },
  value,
  emit,
);
</script>

<template>
  <div v-bind="rootBind">
    <Calendar
      :fill="merged.fill"
      :color="merged.color"
      :error="merged.error"
      :range="merged.range"
      :rounded="merged.rounded"
      :max-date="merged.maxDate"
      :min-date="merged.minDate"
      :disabled="merged.disabled"
      :multiple="merged.multiple"
      :model-value="displayValue"
      :read-only="merged.readOnly"
      :time-zone="merged.timeZone"
      :hide-years="merged.hideYears"
      :hide-months="merged.hideMonths"
      :granularity="merged.granularity"
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
