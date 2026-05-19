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
  iconSize,
  rootBind,
  rootClass,
  isDisabled,
  showAppend,
  showPrepend,
  leftIconBind,
  showLeftIcon,
  rightIconBind,
  showRightIcon,
  showDefaultSlot,
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
    :href="isDisabled ? undefined : merged.href"
    :aria-disabled="isDisabled ? true : undefined"
    :target="merged.external && !isDisabled ? '_blank' : undefined"
    :rel="merged.external && !isDisabled ? 'noopener noreferrer' : undefined"
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
