<script setup lang="ts">
// ** Local Imports
import type { AvatarOwnProps, AvatarSlots } from "@/Components/Avatar";
import { useAvatar } from "@/Components/Avatar";
import { Icon } from "@/Components/Icon";
import { resolveNamedSlot } from "@/Utils";

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

    <img v-bind="imageBind" v-else-if="hasImage" />

    <component
      v-else-if="hasFallbackSlot"
      :is="resolveNamedSlot(slots, 'fallback')"
    />

    <span v-bind="fallbackBind" v-else-if="hasFallbackText">
      {{ merged.fallback }}
    </span>

    <Icon v-else :icon="resolvedIcon" v-bind="iconBind" />
  </div>
</template>
