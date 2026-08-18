<script setup lang="ts">
// ** External Imports
import { isUndefined } from "es-toolkit/compat";
import { computed, ref } from "vue";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import type {
  ColorFieldEmits,
  ColorFieldOwnProps,
  ColorFieldSlots,
} from "@/Components/ColorField/colorField.types";
import { useColorField } from "@/Components/ColorField/composables/useColorField";
import { ColorPicker } from "@/Components/ColorPicker";
import { FieldOverlay } from "@/Components/FieldOverlay";
import {
  FORM_FIELD_CHROME_SLOT_NAMES,
  FormField,
} from "@/Components/FormField";
import { Icon } from "@/Components/Icon";
import { presentSlotNames } from "@/Utils";

defineSlots<ColorFieldSlots>();

defineOptions({ inheritAttrs: false });

const model = defineModel<null | string>();

const props = withDefaults(defineProps<ColorFieldOwnProps>(), {
  clearable: true,
  fill: undefined,
  showSwatch: true,
  showErrorIcon: true,
  showFooter: undefined,
});

const emit = defineEmits<ColorFieldEmits>();

const resolveMessage = useResolveMessage();

const uncontrolledValue = ref<null | string>(props.defaultValue ?? null);

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
  format,
  overlay,
  colorOnly,
  formField,
  inputBind,
  clearBind,
  swatchBind,
  clearValue,
  modelValue,
  showFooter,
  showSwatch,
  pickerClass,
  clearIconSize,
  showClearIcon,
  swatchFillBind,
  handleOpenChange,
  handlePickerChange,
  handlePickerCancel,
  overlayCustomProps,
  colorPickerCustomProps,
} = useColorField(props, value, emit);
</script>

<template>
  <FormField :field="formField">
    <template
      #[name]="slotData"
      v-for="name in presentSlotNames(FORM_FIELD_CHROME_SLOT_NAMES, $slots)"
    >
      <slot :name="name" v-bind="slotData || {}" />
    </template>

    <div class="flex min-w-0 flex-1 items-center gap-2">
      <span v-if="showSwatch" v-bind="swatchBind">
        <span v-bind="swatchFillBind" />
      </span>

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
    <ColorPicker
      :fill="fill"
      :format="format"
      :value="modelValue"
      :class="pickerClass"
      :alpha="colorOnly.alpha"
      :show-footer="showFooter"
      :read-only="props.readonly"
      :swatches="colorOnly.swatches"
      v-on:change="handlePickerChange"
      v-on:cancel="handlePickerCancel"
      :custom-props="colorPickerCustomProps"
      :disabled="formField.isDisabled.value"
      :rounded="formField.merged.value.rounded"
    >
      <template #footer="footer" v-if="$slots.footer">
        <slot name="footer" v-bind="footer" />
      </template>
    </ColorPicker>
  </FieldOverlay>
</template>
