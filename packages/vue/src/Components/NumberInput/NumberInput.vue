<script setup lang="ts">
// ** Local Imports
import type {
  NumberInputProps,
  NumberInputSlots,
} from "@/Components/NumberInput";
import { useNumberInput } from "@/Components/NumberInput";

defineSlots<NumberInputSlots>();

const props = defineProps<NumberInputProps>();

const { slots, merged } = useNumberInput(props, {
  step: 1,
  size: "md",
  rounded: "sm",
  color: "primary",
  variant: "outline",
});
</script>

<template>
  <div class="w-full">
    <slot v-if="slots.label" name="label" />

    <label v-else-if="merged.label">
      {{ merged.label }}
    </label>

    <div class="relative flex items-center">
      <slot name="left" />

      <input
        type="number"
        :max="merged.max"
        :min="merged.min"
        :step="merged.step"
        inputmode="numeric"
        :value="merged.modelValue"
        :disabled="merged.disabled"
        :required="merged.required"
        :placeholder="merged.placeholder"
        class="w-full bg-transparent text-center"
      />

      <slot name="right" />
    </div>

    <slot v-if="slots.description" name="description" />

    <slot v-if="slots.error" name="error" />
  </div>
</template>
