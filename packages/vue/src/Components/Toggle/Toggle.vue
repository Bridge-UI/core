<script setup lang="ts">
// ** Local Imports
import type { ToggleProps, ToggleSlots } from "@/Components/Toggle";
import { useToggle } from "@/Components/Toggle";

defineSlots<ToggleSlots>();

const props = defineProps<ToggleProps>();

const { slots, merged } = useToggle(props, {
  size: "sm",
  color: "primary",
});
</script>

<template>
  <div class="w-full">
    <slot v-if="slots.label" name="label" />

    <label
      v-else-if="merged.label"
      class="relative flex select-none items-center"
    >
      <input
        type="checkbox"
        :disabled="merged.disabled"
        :required="merged.required"
        :checked="merged.modelValue"
        class="peer absolute inset-y-0 my-auto appearance-none border-0"
      />

      <div class="block cursor-pointer" />

      <span class="ml-2">{{ merged.label }}</span>
    </label>

    <label v-else class="relative inline-flex select-none items-center">
      <input
        type="checkbox"
        :disabled="merged.disabled"
        :required="merged.required"
        :checked="merged.modelValue"
        class="peer absolute appearance-none border-0"
      />

      <div class="block cursor-pointer" />
    </label>

    <slot v-if="slots.description" name="description" />
  </div>
</template>
