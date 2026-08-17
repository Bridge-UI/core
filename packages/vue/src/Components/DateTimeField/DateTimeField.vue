<script setup lang="ts">
// ** External Imports
import { isUndefined } from "es-toolkit/compat";
import { computed, ref } from "vue";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import { useDateTimeField } from "@/Components/DateTimeField/composables/useDateTimeField";
import type {
  DateTimeFieldEmits,
  DateTimeFieldOwnProps,
  DateTimeFieldSlots,
} from "@/Components/DateTimeField/dateTimeField.types";
import { DateTimePicker } from "@/Components/DateTimePicker";
import { FieldOverlay } from "@/Components/FieldOverlay";
import {
  FORM_FIELD_CHROME_SLOT_NAMES,
  FormField,
} from "@/Components/FormField";
import { Icon } from "@/Components/Icon";
import { presentSlotNames } from "@/Utils";

defineSlots<DateTimeFieldSlots>();

defineOptions({ inheritAttrs: false });

const model = defineModel<Date | null>();

const props = withDefaults(defineProps<DateTimeFieldOwnProps>(), {
  clearable: true,
  showErrorIcon: true,
  showFooter: undefined,
});

const emit = defineEmits<DateTimeFieldEmits>();

const resolveMessage = useResolveMessage();

const uncontrolledValue = ref<Date | null>(props.defaultValue ?? null);

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
  pickerClass,
  dateTimeOnly,
  clearIconSize,
  showClearIcon,
  handleOpenChange,
  handlePickerChange,
  handlePickerCancel,
  overlayCustomProps,
  dateTimePickerCustomProps,
} = useDateTimeField(props, value, emit);
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
    <DateTimePicker
      :value="modelValue"
      :class="pickerClass"
      :ampm="dateTimeOnly.ampm"
      :show-footer="showFooter"
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
      :error="formField.invalidated.value"
      :color="formField.merged.value.color"
      :hide-months="dateTimeOnly.hideMonths"
      :disabled="formField.isDisabled.value"
      :show-seconds="dateTimeOnly.showSeconds"
      :default-view="dateTimeOnly.defaultView"
      :start-of-week="dateTimeOnly.startOfWeek"
      :custom-props="dateTimePickerCustomProps"
      :rounded="formField.merged.value.rounded"
      :disable-dates="dateTimeOnly.disableDates"
      :hide-weekdays="dateTimeOnly.hideWeekdays"
      :disable-times="dateTimeOnly.disableTimes"
      :disable-years="dateTimeOnly.disableYears"
      :disable-months="dateTimeOnly.disableMonths"
      :hide-outside-days="dateTimeOnly.hideOutsideDays"
    >
      <template #day="cell">
        <slot name="day" v-bind="cell">{{ cell.label }}</slot>
      </template>

      <template #footer="footer" v-if="$slots.footer">
        <slot name="footer" v-bind="footer" />
      </template>
    </DateTimePicker>
  </FieldOverlay>
</template>
