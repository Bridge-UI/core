<script setup lang="ts">
// ** External Imports
import { isUndefined } from "es-toolkit/compat";
import { computed, ref } from "vue";

// ** Core Imports
import type { TimeValue } from "@bridge-ui/core";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import { FieldOverlay } from "@/Components/FieldOverlay";
import {
  FORM_FIELD_CHROME_SLOT_NAMES,
  FormField,
} from "@/Components/FormField";
import { Icon } from "@/Components/Icon";
import { useTimeField } from "@/Components/TimeField/composables/useTimeField";
import type {
  TimeFieldEmits,
  TimeFieldOwnProps,
  TimeFieldSlots,
} from "@/Components/TimeField/timeField.types";
import { TimePicker } from "@/Components/TimePicker";
import { presentSlotNames } from "@/Utils";

defineSlots<TimeFieldSlots>();

defineOptions({ inheritAttrs: false });

const model = defineModel<null | TimeValue>();

const props = withDefaults(defineProps<TimeFieldOwnProps>(), {
  clearable: true,
  showErrorIcon: true,
});

const emit = defineEmits<TimeFieldEmits>();

const resolveMessage = useResolveMessage();

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
  timePickerCustomProps,
} = useTimeField(props, value, emit);
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
    <TimePicker
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
      :color="formField.merged.value.color"
      :custom-props="timePickerCustomProps"
      :disabled="formField.isDisabled.value"
      :disable-times="timeOnly.disableTimes"
      :rounded="formField.merged.value.rounded"
    />
  </FieldOverlay>
</template>
