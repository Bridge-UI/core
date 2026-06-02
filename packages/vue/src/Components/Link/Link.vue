<script setup lang="ts">
// ** Local Imports
import { Icon } from "@/Components/Icon";
import { useLink } from "@/Components/Link/composables/useLink";
import type { LinkOwnProps, LinkSlots } from "@/Components/Link/link.types";
import { hasNamedSlot, resolveNamedSlot } from "@/Utils";

defineSlots<LinkSlots>();

defineOptions({ inheritAttrs: false });

const props = defineProps<LinkOwnProps>();

const {
  slots,
  merged,
  rootRel,
  rootBind,
  rootHref,
  rootTarget,
  leftIconBind,
  rightIconBind,
  rootAriaDisabled,
} = useLink(props, {
  size: "md",
  color: "primary",
  underline: "hover",
});
</script>

<template>
  <a
    :rel="rootRel"
    :href="rootHref"
    v-bind="rootBind"
    :target="rootTarget"
    :aria-disabled="rootAriaDisabled"
  >
    <component
      v-if="hasNamedSlot(slots, 'prepend')"
      :is="resolveNamedSlot(slots, 'prepend')"
    />

    <Icon
      :size="merged.size"
      v-bind="leftIconBind"
      :icon="merged.leftIcon"
      v-else-if="merged.leftIcon"
    />

    <component :is="resolveNamedSlot(slots, 'default')" />

    <component
      v-if="hasNamedSlot(slots, 'append')"
      :is="resolveNamedSlot(slots, 'append')"
    />

    <Icon
      :size="merged.size"
      v-bind="rightIconBind"
      :icon="merged.rightIcon"
      v-else-if="merged.rightIcon"
    />
  </a>
</template>
