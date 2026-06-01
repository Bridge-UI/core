<script setup lang="ts">
// ** Local Imports
import type { CardProps, CardSlots } from "@/Components/Card";
import { useCard } from "@/Components/Card";
import { resolveNamedSlot } from "@/Utils";

defineSlots<CardSlots>();

const props = defineProps<CardProps>();

const { slots } = useCard(props, {
  shadow: "sm",
  rounded: "sm",
  padding: "medium",
});
</script>

<template>
  <div class="flex w-full flex-col">
    <component :is="resolveNamedSlot(slots, 'header')" />

    <div class="grow">
      <component :is="resolveNamedSlot(slots, 'default')" />
    </div>

    <component :is="resolveNamedSlot(slots, 'footer')" />
  </div>
</template>
