<script setup lang="ts">
// ** External Imports
import { isUndefined } from "es-toolkit/compat";
import { computed, ref } from "vue";

// ** Core Imports
import type { TimeRangeValue } from "@bridge-ui/core";

// ** Local Imports
import { FormField } from "@/Components/FormField";
import { Menu } from "@/Components/Menu";
import { useTimeRangeField } from "@/Components/TimeRangeField/composables/useTimeRangeField";
import type {
  TimeRangeFieldEmits,
  TimeRangeFieldOwnProps,
  TimeRangeFieldSlots,
} from "@/Components/TimeRangeField/timeRangeField.types";
import { TimeRangePicker } from "@/Components/TimeRangePicker";

defineSlots<TimeRangeFieldSlots>();

defineOptions({ inheritAttrs: false });

const model = defineModel<null | TimeRangeValue>();

const props = withDefaults(defineProps<TimeRangeFieldOwnProps>(), {
  showErrorIcon: true,
});

const emit = defineEmits<TimeRangeFieldEmits>();

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
  timeOnly,
  formField,
  inputBind,
  menuProps,
  modelValue,
  containerRef,
  handleOpenChange,
  handlePickerChange,
  timeRangePickerCustomProps,
} = useTimeRangeField(props, value, emit);
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
    <TimeRangePicker
      :value="modelValue"
      :ampm="timeOnly.ampm"
      :read-only="props.readonly"
      :max-time="timeOnly.maxTime"
      :min-time="timeOnly.minTime"
      :interval="timeOnly.interval"
      :time-zone="timeOnly.timeZone"
      v-on:change="handlePickerChange"
      :show-footer="timeOnly.showFooter"
      :color="formField.merged.value.color"
      :disabled="formField.isDisabled.value"
      :disable-times="timeOnly.disableTimes"
      :rounded="formField.merged.value.rounded"
      :custom-props="timeRangePickerCustomProps"
    />
  </Menu>
</template>
