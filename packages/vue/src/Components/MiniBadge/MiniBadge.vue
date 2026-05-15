<script setup lang="ts">
// ** Local Imports
import type { MiniBadgeProps, MiniBadgeSlots } from "@/Components/MiniBadge";
import { useMiniBadge } from "@/Components/MiniBadge";

defineSlots<MiniBadgeSlots>();

const props = defineProps<MiniBadgeProps>();

const { slots, merged } = useMiniBadge(props, {
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
