<script setup lang="ts">
// ** Local Imports
import type { ButtonProps, ButtonSlots } from "@/Components/Button";
import { useButton } from "@/Components/Button";

defineSlots<ButtonSlots>();

const props = defineProps<ButtonProps>();

const { slots, merged } = useButton(props, {
  size: "md",
  as: "button",
  rounded: "sm",
  color: "primary",
  variant: "solid",
});
</script>

<template>
  <component
    type="button"
    :href="merged.href"
    :disabled="merged.disabled"
    :is="merged.as ?? 'button'"
    class="inline-flex items-center justify-center outline-none"
  >
    <slot name="prepend" />

    <slot />

    <slot name="append" />
  </component>
</template>
