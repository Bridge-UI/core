<script setup lang="ts">
// ** Local Imports
import type { CardOwnProps, CardSlots } from "@/Components/Card/card.types";
import { useCard } from "@/Components/Card/composables/useCard";
import { hasNamedSlot, hasSlotOrProp, SlotOrProp } from "@/Utils";

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
    <SlotOrProp
      name="header"
      :slots="slots"
      v-if="hasNamedSlot(slots, 'header')"
    />

    <div
      v-bind="headerBind"
      v-else-if="hasSlotOrProp(slots, 'title', merged.title)"
    >
      <div v-bind="titleBind">
        <SlotOrProp name="title" :slots="slots" :fallback="merged.title" />
      </div>

      <SlotOrProp name="action" :slots="slots" />
    </div>

    <div v-bind="bodyBind" v-if="hasDefaultBody">
      <SlotOrProp name="default" :slots="slots" />
    </div>

    <div v-if="hasFooter" v-bind="footerBind">
      <SlotOrProp name="footer" :slots="slots" />
    </div>
  </div>
</template>
