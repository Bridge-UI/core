<script setup lang="ts">
// ** External Imports
import { isUndefined } from "es-toolkit/compat";
import { computed, ref, type ComponentPublicInstance } from "vue";

// ** Core Imports
import {
  resolveSliderBounds,
  resolveSliderDefaultValue,
  type SliderRangeValue,
} from "@bridge-ui/core";

// ** Local Imports
import BaseField from "@/Components/BaseField/BaseField.vue";
import { useSlider } from "@/Components/Slider/composables/useSlider";
import type {
  SliderEmits,
  SliderOwnProps,
  SliderSlots,
} from "@/Components/Slider/slider.types";
import { Tooltip } from "@/Components/Tooltip";

defineSlots<SliderSlots>();

defineOptions({ inheritAttrs: false });

const emit = defineEmits<SliderEmits>();

const props = withDefaults(defineProps<SliderOwnProps>(), {
  showTooltip: true,
});

const model = defineModel<number | undefined | SliderRangeValue>({
  default: undefined,
});

const sliderLibDefaults = {
  min: 0,
  step: 1,
  max: 100,
  size: "md",
  rounded: "full",
  color: "primary",
  showStops: false,
  showTooltip: true,
} as const;

const initialBounds = resolveSliderBounds({
  min: props.min ?? sliderLibDefaults.min,
  max: props.max ?? sliderLibDefaults.max,
  step: props.step ?? sliderLibDefaults.step,
});

const uncontrolledValue = ref<number | SliderRangeValue>(
  resolveSliderDefaultValue({
    min: initialBounds.min,
    max: initialBounds.max,
    step: initialBounds.step,
    range: Boolean(props.range),
    defaultValue: props.defaultValue,
  }),
);

const value = computed({
  set: (next: number | SliderRangeValue) => {
    model.value = next;
    uncontrolledValue.value = next;
  },
  get: (): number | SliderRangeValue => {
    return isUndefined(model.value) ? uncontrolledValue.value : model.value;
  },
});

const thumbRefs = ref<[null | HTMLButtonElement, null | HTMLButtonElement]>([
  null,
  null,
]);

const api = useSlider(() => props, sliderLibDefaults, value, {
  onChange: (next) => {
    emit("change", next);
  },
});

const {
  barBind,
  trackRef,
  baseField,
  trackBind,
  controlBind,
  getStopBind,
  thumbIndexes,
  tooltipProps,
  getThumbBind,
  resolvedStops,
  isTooltipOpen,
  hasStopLabels,
  readThumbValue,
  stopLabelsBind,
  getStopLabelBind,
  getThumbKnobBind,
  showTooltip: tooltipEnabled,
} = api;

function setTrackRef(el: null | Element | ComponentPublicInstance) {
  trackRef.value =
    el instanceof HTMLDivElement
      ? el
      : ((el as null | { $el?: HTMLDivElement })?.$el ?? null);
}

function setThumbRef(
  thumbIndex: 0 | 1,
  el: null | Element | ComponentPublicInstance,
) {
  const button =
    el instanceof HTMLButtonElement
      ? el
      : ((el as null | { $el?: HTMLButtonElement })?.$el ?? null);

  thumbRefs.value[thumbIndex] = button;
}
</script>

<template>
  <BaseField :field="baseField">
    <div v-bind="controlBind">
      <div :ref="setTrackRef" v-bind="trackBind">
        <div v-bind="barBind" />

        <div
          :key="`stop-${stop.value}`"
          v-bind="getStopBind(stop)"
          v-for="stop in resolvedStops"
        />

        <button
          :key="thumbIndex"
          v-for="thumbIndex in thumbIndexes"
          v-bind="getThumbBind(thumbIndex)"
          :ref="(el) => setThumbRef(thumbIndex, el)"
        >
          <slot name="thumb">
            <span v-bind="getThumbKnobBind(thumbIndex)" />
          </slot>
        </button>
      </div>

      <template v-if="tooltipEnabled">
        <Tooltip
          arrow
          size="sm"
          :open-delay="0"
          placement="top"
          :close-delay="0"
          :key="`tooltip-${thumbIndex}`"
          v-for="thumbIndex in thumbIndexes"
          :anchor-el="thumbRefs[thumbIndex]"
          :model-value="isTooltipOpen(thumbIndex)"
          :content="String(readThumbValue(thumbIndex))"
          v-bind="tooltipProps"
        />
      </template>

      <div v-if="hasStopLabels" v-bind="stopLabelsBind">
        <template :key="`label-${stop.value}`" v-for="stop in resolvedStops">
          <div v-if="stop.label" v-bind="getStopLabelBind(stop)">
            {{ stop.label }}
          </div>
        </template>
      </div>
    </div>
  </BaseField>
</template>
