<script setup lang="ts">
// ** Local Imports
import type { AvatarOwnProps, AvatarSlots } from "@/Components/Avatar";
import { useAvatar } from "@/Components/Avatar";
import { Icon } from "@/Components/Icon";
import { hasNamedSlot } from "@/Utils";

defineOptions({ inheritAttrs: false });

defineSlots<AvatarSlots>();

const props = defineProps<AvatarOwnProps>();

const {
  slots,
  merged,
  rootBind,
  iconBind,
  hasImage,
  imageBind,
  fallbackBind,
  resolvedIcon,
  hasFallbackText,
  hasCustomContent,
} = useAvatar(props, {
  size: "md",
  rounded: "full",
  color: "secondary",
});
</script>

<template>
  <div v-bind="rootBind">
    <slot v-if="hasCustomContent" />

    <img v-bind="imageBind" v-else-if="hasImage" />

    <slot name="fallback" v-else-if="hasNamedSlot(slots, 'fallback')" />

    <span v-bind="fallbackBind" v-else-if="hasFallbackText">
      {{ merged.fallback }}
    </span>

    <Icon v-else :icon="resolvedIcon" v-bind="iconBind" />
  </div>
</template>
