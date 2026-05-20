<script setup lang="ts">
// ** Local Imports
import { useMiniBadge } from "@/Components/MiniBadge/composables/useMiniBadge";
import type { MiniBadgeOwnProps } from "@/Components/MiniBadge/miniBadge.types";

defineOptions({ inheritAttrs: false });

const props = defineProps<MiniBadgeOwnProps>();

const { rootBind, rootClass } = useMiniBadge(props, {
  size: "sm",
  rounded: "md",
  variant: "flat",
  color: "primary",
});
</script>

<template>
  <span :class="rootClass" v-bind="rootBind">
    <slot />
  </span>
</template>
