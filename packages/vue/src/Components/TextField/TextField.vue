<script setup lang="ts">
// ** Local Imports
import type { TextFieldProps, TextFieldSlots } from "@/Components/TextField";
import { useTextField } from "@/Components/TextField";

defineSlots<TextFieldSlots>();

const props = defineProps<TextFieldProps>();

const { slots, merged } = useTextField(props, {
  size: "md",
  type: "text",
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
        :type="merged.type"
        :value="merged.modelValue"
        :disabled="merged.disabled"
        :required="merged.required"
        class="w-full bg-transparent"
        :placeholder="merged.placeholder"
      />

      <slot name="right" />
    </div>

    <slot v-if="slots.description" name="description" />

    <slot v-if="slots.error" name="error" />
  </div>
</template>
