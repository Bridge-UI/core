<script setup lang="ts">
// ** Local Imports
import type { CardProps, CardSlots } from "@/Components/Card";
import { useCard } from "@/Components/Card";

defineSlots<CardSlots>();

const props = defineProps<CardProps>();

const { slots, merged } = useCard(props, {
  shadow: "sm",
  rounded: "sm",
  padding: "medium",
});
</script>

<template>
  <div class="flex w-full flex-col">
    <slot v-if="slots.header" name="header" />

    <div class="grow">
      <slot />
    </div>

    <slot v-if="slots.footer" name="footer" />
  </div>
</template>
