<script setup lang="ts">
// ** Local Imports
import type {
  NumberFieldProps,
  NumberFieldSlots,
} from "@/Components/NumberField";
import { useNumberField } from "@/Components/NumberField";

defineSlots<NumberFieldSlots>();

const props = defineProps<NumberFieldProps>();

const { slots, merged } = useNumberField(props, {
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
