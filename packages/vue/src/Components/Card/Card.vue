<script setup lang="ts">
// ** Local Imports
import type { CardOwnProps, CardSlots } from "@/Components/Card/card.types";
import { useCard } from "@/Components/Card/composables/useCard";
import {
  hasNamedSlot,
  hasSlotOrProp,
  resolveNamedSlot,
  resolveSlotOrProp,
} from "@/Utils";

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
    <component
      v-if="hasNamedSlot(slots, 'header')"
      :is="resolveNamedSlot(slots, 'header')"
    />

    <div
      v-bind="headerBind"
      v-else-if="hasSlotOrProp(slots, 'title', merged.title)"
    >
      <div v-bind="titleBind">
        <component :is="resolveSlotOrProp(slots, 'title', merged.title)" />
      </div>

      <component :is="resolveNamedSlot(slots, 'action')" />
    </div>

    <div v-if="hasDefaultBody" v-bind="bodyBind">
      <component :is="resolveNamedSlot(slots, 'default')" />
    </div>

    <div v-if="hasFooter" v-bind="footerBind">
      <component :is="resolveNamedSlot(slots, 'footer')" />
    </div>
  </div>
</template>
