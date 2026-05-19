<script setup lang="ts">
// ** Local Imports
import type { BadgeOwnProps } from "@/Components/Badge/badge.types";
import { useBadge } from "@/Components/Badge/composables/useBadge";

defineOptions({ inheritAttrs: false });

const props = defineProps<BadgeOwnProps>();

const { rootBind, rootClass } = useBadge(props, {
  size: "sm",
  rounded: "full",
  variant: "flat",
  color: "primary",
});
</script>

<template>
  <span :class="rootClass" v-bind="rootBind">
    <slot />
  </span>
</template>
