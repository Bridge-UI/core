<script setup lang="ts">
// ** Local Imports
import type { CardOwnProps, CardSlots } from "@/Components/Card/card.types";
import { useCard } from "@/Components/Card/composables/useCard";
import { Text } from "@/Components/Text";
import { hasNamedSlot, hasSlotOrProp, isPropPresent } from "@/Utils";

defineSlots<CardSlots>();

defineOptions({ inheritAttrs: false });

const props = defineProps<CardOwnProps>();

const {
  slots,
  merged,
  bodyBind,
  rootBind,
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
      <Text as="div" color="inherit" v-bind="titleBind">
        <slot name="title" v-if="hasNamedSlot(slots, 'title')" />

        <template v-else-if="isPropPresent(merged.title)">
          {{ merged.title }}
        </template>
      </Text>

      <slot name="action" />
    </div>

    <Text as="div" color="inherit" v-bind="bodyBind" v-if="hasDefaultBody">
      <slot />
    </Text>

    <div v-bind="footerBind" v-if="hasNamedSlot(slots, 'footer')">
      <slot name="footer" />
    </div>
  </div>
</template>
