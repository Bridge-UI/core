<script setup lang="ts">
// ** Core Imports
import { cn } from "@bridge-ui/core/Utils";

// ** Local Imports
import { Button } from "@/Components/Button";
import type {
  ColorPickerEmits,
  ColorPickerOwnProps,
  ColorPickerSlots,
} from "@/Components/ColorPicker/colorPicker.types";
import { useColorPicker } from "@/Components/ColorPicker/composables/useColorPicker";

defineOptions({ inheritAttrs: false });

defineSlots<ColorPickerSlots>();

const props = withDefaults(defineProps<ColorPickerOwnProps>(), {
  showFooter: undefined,
});

const emit = defineEmits<ColorPickerEmits>();

const {
  merged,
  hueBind,
  rootBind,
  areaBind,
  alphaBind,
  showAlpha,
  swatchCss,
  footerBind,
  applyLabel,
  showFooter,
  previewBind,
  contentBind,
  handleApply,
  cancelLabel,
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
    color: "primary",
  },
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
        <Button
          variant="flat"
          color="secondary"
          v-on:click="handleCancel"
          v-bind="cancelButtonProps"
        >
          {{ cancelLabel }}
        </Button>

        <Button
          color="primary"
          v-bind="applyButtonProps"
          v-on:click="handleApply"
        >
          {{ applyLabel }}
        </Button>
      </slot>
    </div>
  </div>
</template>
