<script setup lang="ts">
// ** Local Imports
import type { MenuProps, MenuSlots } from "@/Components/Menu";
import { useMenu } from "@/Components/Menu";

defineSlots<MenuSlots>();

const props = defineProps<MenuProps>();

const { slots } = useMenu(props, {
  shadow: "md",
  rounded: "md",
});
</script>

<template>
  <div class="relative inline-block text-left">
    <div class="cursor-pointer">
      <slot v-if="slots.trigger" name="trigger" />
    </div>

    <div class="absolute z-30 mt-2 w-56">
      <slot />
    </div>
  </div>
</template>
