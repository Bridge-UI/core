<script setup lang="ts">
// ** Local Imports
import type { AvatarProps, AvatarSlots } from "@/Components/Avatar";
import { useAvatar } from "@/Components/Avatar";
import { Icon } from "@/Components/Icon";
import { resolveNamedSlot } from "@/Utils";

defineOptions({ inheritAttrs: false });

defineSlots<AvatarSlots>();

const props = defineProps<AvatarProps>();

const {
  slots,
  merged,
  rootBind,
  iconBind,
  hasImage,
  imageBind,
  fallbackBind,
  resolvedIcon,
  hasFallbackSlot,
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
    <component
      v-if="hasCustomContent"
      :is="resolveNamedSlot(slots, 'default')"
    />

    <img v-else-if="hasImage" v-bind="imageBind" />

    <component
      v-else-if="hasFallbackSlot"
      :is="resolveNamedSlot(slots, 'fallback')"
    />

    <span v-else-if="hasFallbackText" v-bind="fallbackBind">
      {{ merged.fallback }}
    </span>

    <Icon v-else :icon="resolvedIcon" v-bind="iconBind" />
  </div>
</template>
