<script setup lang="ts">
// ** Local Imports
import { Icon } from "@/Components/Icon";
import { useLink } from "@/Components/Link/composables/useLink";
import type { LinkOwnProps, LinkSlots } from "@/Components/Link/link.types";
import { hasNamedSlot, SlotOrProp } from "@/Utils";

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
    <SlotOrProp
      name="prepend"
      :slots="slots"
      v-if="hasNamedSlot(slots, 'prepend')"
    />

    <Icon
      :size="merged.size"
      v-bind="leftIconBind"
      :icon="merged.leftIcon"
      v-else-if="merged.leftIcon"
    />

    <SlotOrProp name="default" :slots="slots" />

    <SlotOrProp
      name="append"
      :slots="slots"
      v-if="hasNamedSlot(slots, 'append')"
    />

    <Icon
      :size="merged.size"
      v-bind="rightIconBind"
      :icon="merged.rightIcon"
      v-else-if="merged.rightIcon"
    />
  </a>
</template>
