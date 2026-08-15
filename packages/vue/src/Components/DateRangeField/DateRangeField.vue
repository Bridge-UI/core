<script setup lang="ts">
// ** External Imports
import { isUndefined } from "es-toolkit/compat";
import { computed, ref } from "vue";

// ** Core Imports
import type { DateRangeValue } from "@bridge-ui/core/Domain";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import { useDateRangeField } from "@/Components/DateRangeField/composables/useDateRangeField";
import type {
  DateRangeFieldEmits,
  DateRangeFieldOwnProps,
  DateRangeFieldSlots,
} from "@/Components/DateRangeField/dateRangeField.types";
import DateRangePicker from "@/Components/DateRangePicker/DateRangePicker.vue";
import { FieldOverlay } from "@/Components/FieldOverlay";
import {
  FORM_FIELD_CHROME_SLOT_NAMES,
  FormField,
} from "@/Components/FormField";
import { Icon } from "@/Components/Icon";
import { presentSlotNames } from "@/Utils";

defineSlots<DateRangeFieldSlots>();

defineOptions({ inheritAttrs: false });

const model = defineModel<null | DateRangeValue>();

const props = withDefaults(defineProps<DateRangeFieldOwnProps>(), {
  clearable: true,
  showErrorIcon: true,
  showFooter: undefined,
});

const emit = defineEmits<DateRangeFieldEmits>();

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
  dateOnly,
  formField,
  inputBind,
  clearBind,
  clearValue,
  modelValue,
  showFooter,
  orientation,
  pickerClass,
  clearIconSize,
  showClearIcon,
  handleOpenChange,
  handlePickerChange,
  handlePickerCancel,
  overlayCustomProps,
  dateRangePickerCustomProps,
} = useDateRangeField(props, value, emit);
</script>

<template>
  <FormField :field="formField">
    <template
      #[name]="slotData"
      v-for="name in presentSlotNames(FORM_FIELD_CHROME_SLOT_NAMES, $slots)"
    >
      <slot :name="name" v-bind="slotData || {}" />
    </template>

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
    <DateRangePicker
      :value="modelValue"
      :class="pickerClass"
      :show-footer="showFooter"
      :orientation="orientation"
      :read-only="props.readonly"
      :max-date="dateOnly.maxDate"
      :min-date="dateOnly.minDate"
      :time-zone="dateOnly.timeZone"
      v-on:change="handlePickerChange"
      v-on:cancel="handlePickerCancel"
      :hide-years="dateOnly.hideYears"
      :hide-months="dateOnly.hideMonths"
      :color="formField.merged.value.color"
      :start-of-week="dateOnly.startOfWeek"
      :disabled="formField.isDisabled.value"
      :disable-dates="dateOnly.disableDates"
      :hide-weekdays="dateOnly.hideWeekdays"
      :disable-years="dateOnly.disableYears"
      :disable-months="dateOnly.disableMonths"
      :rounded="formField.merged.value.rounded"
      :custom-props="dateRangePickerCustomProps"
      :hide-outside-days="dateOnly.hideOutsideDays"
    >
      <template #day="cell">
        <slot name="day" v-bind="cell">{{ cell.label }}</slot>
      </template>

      <template #footer="footer" v-if="$slots.footer">
        <slot name="footer" v-bind="footer" />
      </template>
    </DateRangePicker>
  </FieldOverlay>
</template>
