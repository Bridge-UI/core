<script setup lang="ts">
// ** External Imports
import { get } from "es-toolkit/compat";
import { ChevronDown, ChevronUp } from "lucide-vue-next";
import { computed } from "vue";

// ** Core Imports
import { cn } from "@bridge-ui/core";
import type { IconSize } from "@bridge-ui/core/Components/Icon";

// ** Local Imports
import { Icon } from "@/Components/Icon";
import { useNumberField } from "@/Components/NumberField/composables/useNumberField";
import type {
  NumberFieldProps,
  NumberFieldSlots,
} from "@/Components/NumberField/numberField.types";
import { TextField } from "@/Components/TextField";
import { useHoldRepeat, useTextFieldEndAdornment } from "@/Utils";

defineSlots<NumberFieldSlots>();

defineOptions({ inheritAttrs: false });

const model = defineModel<number | null | undefined>();

const props = withDefaults(defineProps<NumberFieldProps>(), {
  step: 1,
});

const { increment, decrement } = useNumberField(model, {
  min: props.min,
  max: props.max,
  step: props.step,
});

const incrementHold = useHoldRepeat(
  () => increment(),
  () => ({
    disabled: props.disabled,
  }),
);

const decrementHold = useHoldRepeat(
  () => decrement(),
  () => ({
    disabled: props.disabled,
  }),
);

const { endAdornmentShellClass, endAdornmentButtonClass } =
  useTextFieldEndAdornment(
    () => ({
      color: props.color,
      error: props.error,
      rounded: props.rounded,
      variant: props.variant,
    }),
    {
      rounded: "md",
      color: "primary",
      variant: "outline",
    },
  );

const textFieldProps = computed(() => {
  const {
    min: _min,
    max: _max,
    step: _step,
    modelValue: _modelValue,
    ...rest
  } = props;

  return rest;
});

// prettier-ignore
const stepperIconSize = computed(() => {
  const fieldSize = props.size ?? "md";

  return get({
    "2xs": "xs",
    "xs": "xs",
    "sm": "sm",
    "md": "md",
    "lg": "md",
    "xl": "lg",
    "2xl": "lg",
  }, fieldSize) as keyof IconSize;
});

const mergedPartsProps = computed(() => {
  const inputClass = cn(
    "appearance:textfield [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
    props.partsProps?.input?.class,
  );

  return {
    ...props.partsProps,
    input: {
      ...props.partsProps?.input,
      class: inputClass,
    },
  };
});

const stringModel = computed({
  get: () => {
    if (model.value === undefined || model.value === null) {
      return undefined;
    }

    return String(model.value);
  },
  set: (raw: string | null | undefined) => {
    if (raw === "" || raw === undefined || raw === null) {
      model.value = undefined;

      return;
    }

    const parsed = Number(raw);

    if (!Number.isNaN(parsed)) {
      model.value = parsed;
    }
  },
});
</script>

<template>
  <TextField
    v-model="stringModel"
    v-bind="{
      ...textFieldProps,
      ...$attrs,
    }"
    type="number"
    :min="props.min"
    :max="props.max"
    :step="props.step"
    :classes="props.classes"
    :with-error-icon="false"
    :parts-props="mergedPartsProps"
  >
    <template #end>
      <div
        :class="
          cn({
            [endAdornmentShellClass]: true,
            'flex min-w-9 flex-col gap-px overflow-hidden': true,
          })
        "
      >
        <button
          type="button"
          :disabled="props.disabled"
          aria-label="Increment value"
          v-on:click="incrementHold.onPressClick"
          v-on:pointerup="incrementHold.onPressPointerUp"
          v-on:pointerdown="incrementHold.onPressPointerDown"
          v-on:lostpointercapture="incrementHold.onPressLostPointerCapture"
          :class="
            cn({
              'min-h-0 min-w-8 flex-1': true,
              [endAdornmentButtonClass]: true,
              [props.classes?.increment ?? '']: true,
            })
          "
        >
          <Icon :icon="ChevronUp" :size="stepperIconSize" />
        </button>

        <button
          type="button"
          :disabled="props.disabled"
          aria-label="Decrement value"
          v-on:click="decrementHold.onPressClick"
          v-on:pointerup="decrementHold.onPressPointerUp"
          v-on:pointerdown="decrementHold.onPressPointerDown"
          v-on:lostpointercapture="decrementHold.onPressLostPointerCapture"
          :class="
            cn({
              'min-h-0 min-w-8 flex-1': true,
              [endAdornmentButtonClass]: true,
              [props.classes?.decrement ?? '']: true,
            })
          "
        >
          <Icon :icon="ChevronDown" :size="stepperIconSize" />
        </button>
      </div>
    </template>
  </TextField>
</template>
