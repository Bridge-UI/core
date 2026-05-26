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
        class="flex h-full min-h-0 w-full min-w-9 flex-col gap-px overflow-hidden"
      >
        <button
          type="button"
          v-on:click="increment"
          :disabled="props.disabled"
          aria-label="Increment value"
          :class="
            cn({
              'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-primary-500/40': true,
              'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50': true,
              'dark:hover:bg-gray-700/50 dark:hover:text-gray-300 dark:active:bg-gray-600': true,
              'inline-flex min-h-0 min-w-8 flex-1 items-center justify-center': true,
              'cursor-pointer rounded-sm text-gray-500 transition-colors': true,
              'hover:bg-gray-100 hover:text-gray-700 active:bg-gray-200': true,
              [props.classes?.increment ?? '']: true,
            })
          "
        >
          <Icon :icon="ChevronUp" :size="stepperIconSize" />
        </button>

        <button
          type="button"
          v-on:click="decrement"
          :disabled="props.disabled"
          aria-label="Decrement value"
          :class="
            cn({
              'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-primary-500/40': true,
              'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50': true,
              'dark:hover:bg-gray-700/50 dark:hover:text-gray-300 dark:active:bg-gray-600': true,
              'inline-flex min-h-0 min-w-8 flex-1 items-center justify-center': true,
              'cursor-pointer rounded-sm text-gray-500 transition-colors': true,
              'hover:bg-gray-100 hover:text-gray-700 active:bg-gray-200': true,
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
