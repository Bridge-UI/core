<script setup lang="ts">
// ** External Imports
import { ChevronDown, ChevronUp } from "lucide-vue-next";
import { computed } from "vue";

// ** Core Imports
import {
  fieldStepperButtonClasses,
  numberFieldStepperWrapperClasses,
  resolveStepperIconSize,
} from "@/Components/TextField/fieldAdornment";
import { cn } from "@bridge-ui/core";

// ** Local Imports
import { Icon } from "@/Components/Icon";
import { useNumberField } from "@/Components/NumberField/composables/useNumberField";
import type {
  NumberFieldProps,
  NumberFieldSlots,
} from "@/Components/NumberField/numberField.types";
import { TextField } from "@/Components/TextField";

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

const stepperIconSize = computed(() => resolveStepperIconSize(props.size));

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
      <div :class="numberFieldStepperWrapperClasses">
        <button
          type="button"
          v-on:click="increment"
          :disabled="props.disabled"
          aria-label="Increment value"
          :class="cn(fieldStepperButtonClasses, props.classes?.increment)"
        >
          <Icon :icon="ChevronUp" :size="stepperIconSize" />
        </button>

        <button
          type="button"
          v-on:click="decrement"
          :disabled="props.disabled"
          aria-label="Decrement value"
          :class="cn(fieldStepperButtonClasses, props.classes?.decrement)"
        >
          <Icon :icon="ChevronDown" :size="stepperIconSize" />
        </button>
      </div>
    </template>
  </TextField>
</template>
