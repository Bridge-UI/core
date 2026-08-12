<script setup lang="ts">
// ** Local Imports
import type { AvatarOwnProps, AvatarSlots } from "@/Components/Avatar";
import { useAvatar } from "@/Components/Avatar";
import { Icon } from "@/Components/Icon";
import { SlotOrProp } from "@/Utils";

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
    <SlotOrProp name="default" :slots="slots" v-if="hasCustomContent" />

    <img v-bind="imageBind" v-else-if="hasImage" />

    <SlotOrProp :slots="slots" name="fallback" v-else-if="hasFallbackSlot" />

    <span v-bind="fallbackBind" v-else-if="hasFallbackText">
      {{ merged.fallback }}
    </span>

    <Icon v-else :icon="resolvedIcon" v-bind="iconBind" />
  </div>
</template>
