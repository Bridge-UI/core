<script setup lang="ts">
// ** Local Imports
import type { BadgeOwnProps } from "@/Components/Badge/badge.types";
import { useBadge } from "@/Components/Badge/composables/useBadge";

defineOptions({ inheritAttrs: false });

const props = defineProps<BadgeOwnProps>();

const { rootBind } = useBadge(props, {
  size: "sm",
  rounded: "md",
  variant: "flat",
  color: "primary",
  density: "default",
});
</script>

<template>
  <span v-bind="rootBind">
    <slot />
  </span>
</template>
