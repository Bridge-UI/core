<script setup lang="ts">
// ** External Imports
import { isUndefined } from "es-toolkit/compat";
import { computed, ref } from "vue";

// ** Core Imports
import type { DateRangeValue } from "@bridge-ui/core";

// ** Local Imports
import { useDateRangeField } from "@/Components/DateRangeField/composables/useDateRangeField";
import type {
  DateRangeFieldEmits,
  DateRangeFieldOwnProps,
  DateRangeFieldSlots,
} from "@/Components/DateRangeField/dateRangeField.types";
import DateRangePicker from "@/Components/DateRangePicker/DateRangePicker.vue";
import { FormField } from "@/Components/FormField";
import { Menu } from "@/Components/Menu";

defineSlots<DateRangeFieldSlots>();

defineOptions({ inheritAttrs: false });

const model = defineModel<null | DateRangeValue>();

const props = withDefaults(defineProps<DateRangeFieldOwnProps>(), {
  showErrorIcon: true,
});

const emit = defineEmits<DateRangeFieldEmits>();

const uncontrolledValue = ref<null | DateRangeValue>(
  props.defaultValue ?? null,
);

const value = computed({
  set: (next) => {
    model.value = next;
    uncontrolledValue.value = next;
  },
  get: () => {
    return isUndefined(model.value) ? uncontrolledValue.value : model.value;
  },
});

const {
  open,
  dateOnly,
  formField,
  inputBind,
  menuProps,
  modelValue,
  containerRef,
  handleOpenChange,
  handlePickerChange,
  dateRangePickerCustomProps,
} = useDateRangeField(props, value, emit);
</script>

<template>
  <FormField :field="formField">
    <input v-bind="inputBind" />
  </FormField>

  <Menu
    v-model="open"
    close-on-click-away
    placement="bottom-start"
    :anchor-el="containerRef"
    v-bind="menuProps"
    v-on:update:model-value="handleOpenChange"
  >
    <DateRangePicker
      :value="modelValue"
      :read-only="props.readonly"
      :max-date="dateOnly.maxDate"
      :min-date="dateOnly.minDate"
      :time-zone="dateOnly.timeZone"
      v-on:change="handlePickerChange"
      :hide-years="dateOnly.hideYears"
      :show-footer="dateOnly.showFooter"
      :hide-months="dateOnly.hideMonths"
      :orientation="dateOnly.orientation"
      :color="formField.merged.value.color"
      :start-of-week="dateOnly.startOfWeek"
      :disabled="formField.isDisabled.value"
      :disable-dates="dateOnly.disableDates"
      :hide-weekdays="dateOnly.hideWeekdays"
      :disable-years="dateOnly.disableYears"
      :disable-months="dateOnly.disableMonths"
      :rounded="formField.merged.value.rounded"
      :custom-props="dateRangePickerCustomProps"
    >
      <template #day="cell">
        <slot name="day" v-bind="cell">{{ cell.label }}</slot>
      </template>
    </DateRangePicker>
  </Menu>
</template>
