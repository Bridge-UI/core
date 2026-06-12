<script setup lang="ts">
// ** External Imports
import { isNil } from "es-toolkit/compat";
import { ChevronDown, ChevronUp } from "lucide-vue-next";
import { computed } from "vue";

// ** Core Imports
import { cn } from "@bridge-ui/core";

// ** Local Imports
import { Icon } from "@/Components/Icon";
import { useNumberField } from "@/Components/NumberField/composables/useNumberField";
import { useNumberFieldClasses } from "@/Components/NumberField/composables/useNumberFieldClasses";
import type {
  NumberFieldOwnProps,
  NumberFieldSlots,
} from "@/Components/NumberField/numberField.types";
import { TextField } from "@/Components/TextField";
import { resolveFieldAdornmentIconSize, useHoldRepeat } from "@/Utils";

defineSlots<NumberFieldSlots>();

defineOptions({ inheritAttrs: false });

const model = defineModel<number | null | undefined>();

const props = withDefaults(defineProps<NumberFieldOwnProps>(), {
  step: 1,
});

const mergedClasses = useNumberFieldClasses(props);

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

const textFieldProps = computed(() => {
  const { min: _min, max: _max, step: _step, ...rest } = props;

  return rest;
});

const stepperIconSize = computed(() => {
  return resolveFieldAdornmentIconSize(props.size);
});

const mergedCustomProps = computed(() => {
  const inputClass = cn(
    "appearance:textfield [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
    props.customProps?.input?.class,
  );

  return {
    ...props.customProps,
    input: {
      ...props.customProps?.input,
      class: inputClass,
    },
  };
});

const stringModel = computed({
  get: () => {
    if (isNil(model.value)) {
      return undefined;
    }

    return String(model.value);
  },
  set: (raw: string | null | undefined) => {
    if (raw === "" || isNil(raw)) {
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
    :classes="mergedClasses"
    :with-error-icon="false"
    :parts-props="mergedCustomProps"
  >
    <template #end>
      <div
        :class="
          cn(
            'bridge-end-adornment flex h-full min-w-9 flex-col gap-px overflow-hidden',
          )
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
            cn(
              'bridge-field-adornment-button inline-flex min-h-0 min-w-8 flex-1 items-center justify-center',
              mergedClasses.increment,
            )
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
            cn(
              'bridge-field-adornment-button inline-flex min-h-0 min-w-8 flex-1 items-center justify-center',
              mergedClasses.decrement,
            )
          "
        >
          <Icon :icon="ChevronDown" :size="stepperIconSize" />
        </button>
      </div>
    </template>
  </TextField>
</template>
