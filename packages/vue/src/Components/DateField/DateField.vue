<script setup lang="ts">
// ** External Imports
import { isUndefined } from "es-toolkit/compat";
import { computed, ref } from "vue";

// ** Core Imports
import type { DatePickerModel } from "@bridge-ui/core/Domain";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import { useDateField } from "@/Components/DateField/composables/useDateField";
import type {
  DateFieldEmits,
  DateFieldOwnProps,
  DateFieldSlots,
} from "@/Components/DateField/dateField.types";
import { DatePicker } from "@/Components/DatePicker";
import { FieldOverlay } from "@/Components/FieldOverlay";
import {
  FORM_FIELD_CHROME_SLOT_NAMES,
  FormField,
} from "@/Components/FormField";
import { Icon } from "@/Components/Icon";
import { presentSlotNames } from "@/Utils";

defineSlots<DateFieldSlots>();

defineOptions({ inheritAttrs: false });

const model = defineModel<DatePickerModel>();

const props = withDefaults(defineProps<DateFieldOwnProps>(), {
  clearable: true,
  showErrorIcon: true,
  showFooter: undefined,
});

const emit = defineEmits<DateFieldEmits>();

const resolveMessage = useResolveMessage();

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
  overlay,
  dateOnly,
  formField,
  inputBind,
  clearBind,
  clearValue,
  modelValue,
  showFooter,
  pickerClass,
  clearIconSize,
  showClearIcon,
  handleOpenChange,
  handlePickerChange,
  handlePickerCancel,
  overlayCustomProps,
  datePickerCustomProps,
} = useDateField(props, value, emit);
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
    :overlay="overlay"
    :model-value="open"
    :custom-props="overlayCustomProps"
    v-on:update:model-value="handleOpenChange"
  >
    <DatePicker
      :value="modelValue"
      :class="pickerClass"
      :range="dateOnly.range"
      :show-footer="showFooter"
      :read-only="props.readonly"
      :max-date="dateOnly.maxDate"
      :min-date="dateOnly.minDate"
      :multiple="dateOnly.multiple"
      :time-zone="dateOnly.timeZone"
      :hide-years="dateOnly.hideYears"
      v-on:change="handlePickerChange"
      v-on:cancel="handlePickerCancel"
      :hide-months="dateOnly.hideMonths"
      :default-view="dateOnly.defaultView"
      :error="formField.invalidated.value"
      :color="formField.merged.value.color"
      :start-of-week="dateOnly.startOfWeek"
      :custom-props="datePickerCustomProps"
      :disabled="formField.isDisabled.value"
      :disable-dates="dateOnly.disableDates"
      :hide-weekdays="dateOnly.hideWeekdays"
      :disable-years="dateOnly.disableYears"
      :disable-months="dateOnly.disableMonths"
      :rounded="formField.merged.value.rounded"
      :hide-outside-days="dateOnly.hideOutsideDays"
    >
      <template #day="cell">
        <slot name="day" v-bind="cell">{{ cell.label }}</slot>
      </template>

      <template #footer="footer" v-if="$slots.footer">
        <slot name="footer" v-bind="footer" />
      </template>
    </DatePicker>
  </FieldOverlay>
</template>
