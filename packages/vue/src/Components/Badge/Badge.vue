<script setup lang="ts">
// ** Local Imports
import type { BadgeProps, BadgeSlots } from "@/Components/Badge";
import { useBadge } from "@/Components/Badge";

defineSlots<BadgeSlots>();

const props = defineProps<BadgeProps>();

const { slots, merged } = useBadge(props, {
  size: "sm",
  rounded: "sm",
  color: "primary",
  variant: "solid",
});
</script>

<template>
  <span class="inline-flex items-center justify-center outline-none">
    <slot />
  </span>
</template>
