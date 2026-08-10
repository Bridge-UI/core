<script setup lang="ts">
// ** External Imports
import { isUndefined } from "es-toolkit/compat";
import { computed, ref } from "vue";

// ** Core Imports
import type { DateRangeValue } from "@bridge-ui/core";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import { useDateTimeRangeField } from "@/Components/DateTimeRangeField/composables/useDateTimeRangeField";
import type {
  DateTimeRangeFieldEmits,
  DateTimeRangeFieldOwnProps,
  DateTimeRangeFieldSlots,
} from "@/Components/DateTimeRangeField/dateTimeRangeField.types";
import { DateTimeRangePicker } from "@/Components/DateTimeRangePicker";
import { FieldOverlay } from "@/Components/FieldOverlay";
import { FormField } from "@/Components/FormField";
import { Icon } from "@/Components/Icon";

defineSlots<DateTimeRangeFieldSlots>();

defineOptions({ inheritAttrs: false });

const model = defineModel<null | DateRangeValue>();

const props = withDefaults(defineProps<DateTimeRangeFieldOwnProps>(), {
  clearable: true,
  showErrorIcon: true,
});

const emit = defineEmits<DateTimeRangeFieldEmits>();

const resolveMessage = useResolveMessage();

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
  overlay,
  formField,
  inputBind,
  clearBind,
  clearValue,
  modelValue,
  showFooter,
  orientation,
  pickerClass,
  dateTimeOnly,
  clearIconSize,
  showClearIcon,
  handleOpenChange,
  handlePickerChange,
  handlePickerCancel,
  overlayCustomProps,
  dateTimeRangePickerCustomProps,
} = useDateTimeRangeField(props, value, emit);
</script>

<template>
  <FormField :field="formField">
    <div class="flex min-w-0 flex-1 items-center gap-1">
      <input v-bind="inputBind" />

      <span
        v-bind="clearBind"
        v-if="showClearIcon"
        v-on:click="clearValue"
        :aria-label="resolveMessage('Clear')"
        v-on:keydown.enter.prevent="clearValue"
        v-on:keydown.space.prevent="clearValue"
      >
        <Icon
          icon="clear"
          :size="clearIconSize"
          v-bind="props.customProps?.clearIcon"
        />
      </span>
    </div>
  </FormField>

  <FieldOverlay
    v-model="open"
    :overlay="overlay"
    :custom-props="overlayCustomProps"
    v-on:update:model-value="handleOpenChange"
  >
    <DateTimeRangePicker
      :value="modelValue"
      :class="pickerClass"
      :ampm="dateTimeOnly.ampm"
      :show-footer="showFooter"
      :orientation="orientation"
      :read-only="props.readonly"
      :max-date="dateTimeOnly.maxDate"
      :min-date="dateTimeOnly.minDate"
      :max-time="dateTimeOnly.maxTime"
      :min-time="dateTimeOnly.minTime"
      v-on:change="handlePickerChange"
      v-on:cancel="handlePickerCancel"
      :interval="dateTimeOnly.interval"
      :time-zone="dateTimeOnly.timeZone"
      :hide-years="dateTimeOnly.hideYears"
      :color="formField.merged.value.color"
      :hide-months="dateTimeOnly.hideMonths"
      :disabled="formField.isDisabled.value"
      :start-of-week="dateTimeOnly.startOfWeek"
      :rounded="formField.merged.value.rounded"
      :disable-dates="dateTimeOnly.disableDates"
      :hide-weekdays="dateTimeOnly.hideWeekdays"
      :disable-times="dateTimeOnly.disableTimes"
      :disable-years="dateTimeOnly.disableYears"
      :disable-months="dateTimeOnly.disableMonths"
      :custom-props="dateTimeRangePickerCustomProps"
      :hide-outside-days="dateTimeOnly.hideOutsideDays"
    >
      <template #day="cell">
        <slot name="day" v-bind="cell">{{ cell.label }}</slot>
      </template>
    </DateTimeRangePicker>
  </FieldOverlay>
</template>
