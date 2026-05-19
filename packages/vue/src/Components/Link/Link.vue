<script setup lang="ts">
// ** Local Imports
import { Icon } from "@/Components/Icon";
import { useLink } from "@/Components/Link/composables/useLink";
import type { LinkOwnProps, LinkSlots } from "@/Components/Link/link.types";

defineSlots<LinkSlots>();

defineOptions({ inheritAttrs: false });

const props = defineProps<LinkOwnProps>();

const {
  merged,
  rootBind,
  iconSize,
  rootClass,
  isDisabled,
  showAppend,
  showPrepend,
  showLeftIcon,
  showRightIcon,
  showDefaultSlot,
  leftIconBind,
  rightIconBind,
} = useLink(props, {
  size: "md",
  color: "primary",
  underline: "hover",
});
</script>

<template>
  <a
    v-bind="rootBind"
    :class="rootClass"
    :aria-disabled="isDisabled ? true : undefined"
    :href="isDisabled ? undefined : merged.href"
    :rel="merged.external && !isDisabled ? 'noopener noreferrer' : undefined"
    :target="merged.external && !isDisabled ? '_blank' : undefined"
  >
    <slot v-if="showPrepend" name="prepend" />

    <Icon
      v-if="showLeftIcon && merged.leftIcon"
      :icon="merged.leftIcon"
      :size="iconSize"
      v-bind="leftIconBind"
    />

    <slot v-if="showDefaultSlot" />

    <Icon
      v-if="showRightIcon && merged.rightIcon"
      :icon="merged.rightIcon"
      :size="iconSize"
      v-bind="rightIconBind"
    />

    <slot v-if="showAppend" name="append" />
  </a>
</template>
