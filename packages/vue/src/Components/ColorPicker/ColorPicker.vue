<script setup lang="ts">
// ** External Imports
import { ref } from "vue";

// ** Core Imports
import { cn } from "@bridge-ui/core/Utils";

// ** Local Imports
import { ActionFooter } from "@/Components/ActionFooter";
import type {
  ColorPickerEmits,
  ColorPickerOwnProps,
  ColorPickerSlots,
} from "@/Components/ColorPicker/colorPicker.types";
import { useColorPicker } from "@/Components/ColorPicker/composables/useColorPicker";
import { useOptionalModel } from "@/Utils";

defineSlots<ColorPickerSlots>();

defineOptions({ inheritAttrs: false });

const model = defineModel<null | string>();

const emit = defineEmits<ColorPickerEmits>();

const props = withDefaults(defineProps<ColorPickerOwnProps>(), {
  showFooter: undefined,
});

const uncontrolledValue = ref<null | string>(props.defaultValue ?? null);

const value = useOptionalModel(model, uncontrolledValue);

const {
  merged,
  hueBind,
  rootBind,
  areaBind,
  alphaBind,
  showAlpha,
  swatchCss,
  footerBind,
  showFooter,
  previewBind,
  contentBind,
  handleApply,
  swatchesBind,
  handleCancel,
  hueThumbBind,
  areaThumbBind,
  alphaFillBind,
  formattedValue,
  alphaThumbBind,
  presetSwatches,
  applyButtonProps,
  isSwatchSelected,
  previewSwatchBind,
  handleSwatchClick,
  swatchButtonClass,
  cancelButtonProps,
  swatchSelectedClass,
  previewSwatchFillBind,
} = useColorPicker(
  props,
  {
    rounded: "md",
    format: "hex",
  },
  value,
  emit,
);
</script>

<template>
  <div v-bind="rootBind">
    <div :class="contentBind">
      <div v-bind="areaBind">
        <span
          aria-hidden
          class="pointer-events-none absolute inset-0"
          :style="{
            backgroundImage: 'linear-gradient(to right, #fff, transparent)',
          }"
        />
        <span
          aria-hidden
          class="pointer-events-none absolute inset-0"
          :style="{
            backgroundImage: 'linear-gradient(to top, #000, transparent)',
          }"
        />
        <span v-bind="areaThumbBind" />
      </div>

      <div v-bind="hueBind">
        <span v-bind="hueThumbBind" />
      </div>

      <div v-if="showAlpha" v-bind="alphaBind">
        <span v-bind="alphaFillBind" />
        <span v-bind="alphaThumbBind" />
      </div>

      <div v-bind="previewBind">
        <span v-bind="previewSwatchBind">
          <span v-bind="previewSwatchFillBind" />
        </span>
        <span class="min-w-0 truncate text-sm text-dark-700 dark:text-dark-100">
          {{ formattedValue }}
        </span>
      </div>

      <div v-bind="swatchesBind" v-if="presetSwatches.length > 0">
        <button
          type="button"
          :key="swatch"
          :aria-label="swatch"
          v-for="swatch in presetSwatches"
          v-on:click="handleSwatchClick(swatch)"
          :aria-pressed="isSwatchSelected(swatch)"
          :disabled="merged.disabled || merged.readOnly"
          :class="
            cn({
              [swatchButtonClass]: true,
              [swatchSelectedClass]: isSwatchSelected(swatch),
            })
          "
        >
          <span
            aria-hidden
            class="absolute inset-0"
            :style="{ backgroundColor: swatchCss(swatch) }"
          />
        </button>
      </div>
    </div>

    <div v-if="showFooter" v-bind="footerBind">
      <slot name="footer" :apply="handleApply" :cancel="handleCancel">
        <ActionFooter
          v-on:apply="handleApply"
          v-on:cancel="handleCancel"
          :custom-props="{
            applyButton: applyButtonProps,
            cancelButton: cancelButtonProps,
          }"
        />
      </slot>
    </div>
  </div>
</template>
