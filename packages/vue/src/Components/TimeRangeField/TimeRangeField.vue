<script setup lang="ts">
// ** External Imports
import { isUndefined } from "es-toolkit/compat";
import { computed, ref } from "vue";

// ** Core Imports
import type { TimeRangeValue } from "@bridge-ui/core/Domain";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import { FieldOverlay } from "@/Components/FieldOverlay";
import {
  FORM_FIELD_CHROME_SLOT_NAMES,
  FormField,
} from "@/Components/FormField";
import { Icon } from "@/Components/Icon";
import { useTimeRangeField } from "@/Components/TimeRangeField/composables/useTimeRangeField";
import type {
  TimeRangeFieldEmits,
  TimeRangeFieldOwnProps,
  TimeRangeFieldSlots,
} from "@/Components/TimeRangeField/timeRangeField.types";
import { TimeRangePicker } from "@/Components/TimeRangePicker";
import { presentSlotNames } from "@/Utils";

defineSlots<TimeRangeFieldSlots>();

defineOptions({ inheritAttrs: false });

const model = defineModel<null | TimeRangeValue>();

const props = withDefaults(defineProps<TimeRangeFieldOwnProps>(), {
  clearable: true,
  fill: undefined,
  showErrorIcon: true,
  showFooter: undefined,
});

const emit = defineEmits<TimeRangeFieldEmits>();

const resolveMessage = useResolveMessage();

const uncontrolledValue = ref<null | TimeRangeValue>(
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
  fill,
  overlay,
  timeOnly,
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
  timeRangePickerCustomProps,
} = useTimeRangeField(props, value, emit);
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
    <TimeRangePicker
      :fill="fill"
      :value="modelValue"
      :class="pickerClass"
      :ampm="timeOnly.ampm"
      :show-footer="showFooter"
      :read-only="props.readonly"
      :max-time="timeOnly.maxTime"
      :min-time="timeOnly.minTime"
      :interval="timeOnly.interval"
      :time-zone="timeOnly.timeZone"
      v-on:change="handlePickerChange"
      v-on:cancel="handlePickerCancel"
      :show-seconds="timeOnly.showSeconds"
      :error="formField.invalidated.value"
      :color="formField.merged.value.color"
      :disabled="formField.isDisabled.value"
      :disable-times="timeOnly.disableTimes"
      :rounded="formField.merged.value.rounded"
      :custom-props="timeRangePickerCustomProps"
    >
      <template #footer="footer" v-if="$slots.footer">
        <slot name="footer" v-bind="footer" />
      </template>
    </TimeRangePicker>
  </FieldOverlay>
</template>
