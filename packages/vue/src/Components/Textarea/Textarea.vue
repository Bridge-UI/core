<script setup lang="ts">
// ** Local Imports
import type { TextareaProps, TextareaSlots } from "@/Components/Textarea";
import { useTextarea } from "@/Components/Textarea";

defineSlots<TextareaSlots>();

const props = defineProps<TextareaProps>();

const { slots, merged } = useTextarea(props, {
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

    <textarea
      :value="merged.modelValue"
      :disabled="merged.disabled"
      :required="merged.required"
      class="w-full bg-transparent"
      :placeholder="merged.placeholder"
    />

    <slot v-if="slots.description" name="description" />

    <slot v-if="slots.error" name="error" />
  </div>
</template>
