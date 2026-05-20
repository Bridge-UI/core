<script setup lang="ts">
// ** Local Imports
import type {
  PasswordFieldProps,
  PasswordFieldSlots,
} from "@/Components/PasswordField";
import { usePasswordField } from "@/Components/PasswordField";

defineSlots<PasswordFieldSlots>();

const props = defineProps<PasswordFieldProps>();

const { slots, merged } = usePasswordField(props, {
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
        :disabled="merged.disabled"
        :placeholder="merged.placeholder"
        :required="merged.required"
        :value="merged.modelValue"
        class="w-full bg-transparent"
        type="password"
      />

      <slot name="right" />
    </div>

    <slot v-if="slots.description" name="description" />

    <slot v-if="slots.error" name="error" />
  </div>
</template>
