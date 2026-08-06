<script setup lang="ts">
// ** External Imports
import { isUndefined } from "es-toolkit/compat";
import { computed, ref } from "vue";

// ** Core Imports
import type { DatePickerModel } from "@bridge-ui/core";

// ** Local Imports
import { useDateField } from "@/Components/DateField/composables/useDateField";
import type {
  DateFieldEmits,
  DateFieldOwnProps,
  DateFieldSlots,
} from "@/Components/DateField/dateField.types";
import { DatePicker } from "@/Components/DatePicker";
import { FormField } from "@/Components/FormField";
import { Menu } from "@/Components/Menu";

defineSlots<DateFieldSlots>();

defineOptions({ inheritAttrs: false });

const model = defineModel<DatePickerModel>();

const props = withDefaults(defineProps<DateFieldOwnProps>(), {
  showErrorIcon: true,
});

const emit = defineEmits<DateFieldEmits>();

const uncontrolledValue = ref<DatePickerModel>(props.defaultValue ?? null);

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
  datePickerCustomProps,
} = useDateField(props, value, emit);
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
    <DatePicker
      color="primary"
      :value="modelValue"
      :range="dateOnly.range"
      :read-only="props.readonly"
      :max-date="dateOnly.maxDate"
      :min-date="dateOnly.minDate"
      :multiple="dateOnly.multiple"
      :time-zone="dateOnly.timeZone"
      :hide-years="dateOnly.hideYears"
      v-on:change="handlePickerChange"
      :show-footer="dateOnly.showFooter"
      :hide-months="dateOnly.hideMonths"
      :default-view="dateOnly.defaultView"
      :start-of-week="dateOnly.startOfWeek"
      :custom-props="datePickerCustomProps"
      :disabled="formField.isDisabled.value"
      :disable-dates="dateOnly.disableDates"
      :hide-weekdays="dateOnly.hideWeekdays"
      :disable-years="dateOnly.disableYears"
      :disable-months="dateOnly.disableMonths"
      :rounded="formField.merged.value.rounded"
    >
      <template #day="cell">
        <slot name="day" v-bind="cell">{{ cell.label }}</slot>
      </template>
    </DatePicker>
  </Menu>
</template>
