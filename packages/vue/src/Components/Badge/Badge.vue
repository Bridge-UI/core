<script setup lang="ts">
// ** External Imports
import { useSlots } from "vue";

// ** Local Imports
import type { BadgeOwnProps } from "@/Components/Badge/badge.types";
import { useBadge } from "@/Components/Badge/composables/useBadge";
import { resolveNamedSlot } from "@/Utils";

const slots = useSlots();

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
    <component :is="resolveNamedSlot(slots, 'default')" />
  </span>
</template>
