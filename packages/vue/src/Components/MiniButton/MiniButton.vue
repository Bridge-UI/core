<script setup lang="ts">
// ** Local Imports
import type { MiniButtonProps, MiniButtonSlots } from "@/Components/MiniButton";
import { useMiniButton } from "@/Components/MiniButton";

defineSlots<MiniButtonSlots>();

const props = defineProps<MiniButtonProps>();

const { slots, merged } = useMiniButton(props, {
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
    :is="merged.as ?? 'button'"
    :disabled="merged.disabled"
    class="inline-flex items-center justify-center outline-none"
  >
    <slot />
  </component>
</template>
