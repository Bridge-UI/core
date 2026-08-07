<script setup lang="ts">
// ** External Imports
import { isUndefined } from "es-toolkit/compat";
import { computed, ref } from "vue";

// ** Core Imports
import type { TimeValue } from "@bridge-ui/core";

// ** Local Imports
import { FieldOverlay } from "@/Components/FieldOverlay";
import { FormField } from "@/Components/FormField";
import { useTimeField } from "@/Components/TimeField/composables/useTimeField";
import type {
  TimeFieldEmits,
  TimeFieldOwnProps,
  TimeFieldSlots,
} from "@/Components/TimeField/timeField.types";
import { TimePicker } from "@/Components/TimePicker";

defineSlots<TimeFieldSlots>();

defineOptions({ inheritAttrs: false });

const model = defineModel<null | TimeValue>();

const props = withDefaults(defineProps<TimeFieldOwnProps>(), {
  showErrorIcon: true,
});

const emit = defineEmits<TimeFieldEmits>();

const uncontrolledValue = ref<null | TimeValue>(props.defaultValue ?? null);

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
  timeOnly,
  formField,
  inputBind,
  modelValue,
  handleOpenChange,
  handlePickerChange,
  handlePickerCancel,
  overlayCustomProps,
  timePickerCustomProps,
} = useTimeField(props, value, emit);
</script>

<template>
  <FormField :field="formField">
    <input v-bind="inputBind" />
  </FormField>

  <FieldOverlay
    v-model="open"
    :overlay="overlay"
    :custom-props="overlayCustomProps"
    v-on:update:model-value="handleOpenChange"
  >
    <TimePicker
      :value="modelValue"
      :ampm="timeOnly.ampm"
      :read-only="props.readonly"
      :max-time="timeOnly.maxTime"
      :min-time="timeOnly.minTime"
      :interval="timeOnly.interval"
      :time-zone="timeOnly.timeZone"
      v-on:change="handlePickerChange"
      v-on:cancel="handlePickerCancel"
      :show-footer="timeOnly.showFooter"
      :color="formField.merged.value.color"
      :custom-props="timePickerCustomProps"
      :disabled="formField.isDisabled.value"
      :disable-times="timeOnly.disableTimes"
      :rounded="formField.merged.value.rounded"
    />
  </FieldOverlay>
</template>
