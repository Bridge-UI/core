<script setup lang="ts">
// ** Local Imports
import type { LinkProps, LinkSlots } from "@/Components/Link";
import { useLink } from "@/Components/Link";

defineSlots<LinkSlots>();

const props = defineProps<LinkProps>();

const { slots, merged } = useLink(props, {
  size: "md",
  color: "primary",
  underline: "hover",
});
</script>

<template>
  <component
    :href="merged.href"
    :is="merged.href ? 'a' : 'span'"
    class="inline-block text-center font-semibold"
  >
    <slot name="prepend" />

    <slot />

    <slot name="append" />
  </component>
</template>
