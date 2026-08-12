<script setup lang="ts">
// ** Local Imports
import type { CardOwnProps, CardSlots } from "@/Components/Card/card.types";
import { useCard } from "@/Components/Card/composables/useCard";
import { hasNamedSlot, hasSlotOrProp, isPropPresent } from "@/Utils";

defineSlots<CardSlots>();

defineOptions({ inheritAttrs: false });

const props = defineProps<CardOwnProps>();

const {
  slots,
  merged,
  bodyBind,
  rootBind,
  hasFooter,
  titleBind,
  footerBind,
  headerBind,
  hasDefaultBody,
} = useCard(props, {
  shadow: "sm",
  rounded: "sm",
  padding: "medium",
  variant: "elevated",
});
</script>

<template>
  <div v-bind="rootBind">
    <slot name="header" v-if="hasNamedSlot(slots, 'header')" />

    <div
      v-bind="headerBind"
      v-else-if="hasSlotOrProp(slots, 'title', merged.title)"
    >
      <div v-bind="titleBind">
        <slot name="title" v-if="hasNamedSlot(slots, 'title')" />

        <template v-else-if="isPropPresent(merged.title)">
          {{ merged.title }}
        </template>
      </div>

      <slot name="action" />
    </div>

    <div v-bind="bodyBind" v-if="hasDefaultBody">
      <slot />
    </div>

    <div v-if="hasFooter" v-bind="footerBind">
      <slot name="footer" />
    </div>
  </div>
</template>
