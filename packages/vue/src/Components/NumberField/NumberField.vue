<script setup lang="ts">
// ** External Imports
import { ChevronDown, ChevronUp } from "lucide-vue-next";
import { computed } from "vue";

// ** Core Imports
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
      <div class="flex min-h-0 flex-1 flex-col self-stretch py-0.5 pe-0.5">
        <button
          type="button"
          v-on:click="increment"
          :disabled="props.disabled"
          aria-label="Increment value"
          :class="
            cn({
              'inline-flex flex-1 items-center justify-center text-gray-500 transition-colors': true,
              'disabled:pointer-events-none disabled:opacity-50': true,
              'hover:text-gray-700 dark:hover:text-gray-300': true,
              [props.classes?.increment ?? '']: true,
            })
          "
        >
          <Icon :icon="ChevronUp" :size="props.size ?? 'md'" />
        </button>

        <button
          type="button"
          v-on:click="decrement"
          :disabled="props.disabled"
          aria-label="Decrement value"
          :class="
            cn({
              'inline-flex flex-1 items-center justify-center text-gray-500 transition-colors': true,
              'disabled:pointer-events-none disabled:opacity-50': true,
              'hover:text-gray-700 dark:hover:text-gray-300': true,
              [props.classes?.decrement ?? '']: true,
            })
          "
        >
          <Icon :icon="ChevronDown" :size="props.size ?? 'md'" />
        </button>
      </div>
    </template>
  </TextField>
</template>
