<script setup lang="ts">
// ** Local Imports
import type { MenuProps, MenuSlots } from "@/Components/Menu";
import { useMenu } from "@/Components/Menu";
import { resolveNamedSlot } from "@/Utils";

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
      <component :is="resolveNamedSlot(slots, 'trigger')" />
    </div>

    <div class="absolute z-30 mt-2 w-56">
      <component :is="resolveNamedSlot(slots, 'default')" />
    </div>
  </div>
</template>
