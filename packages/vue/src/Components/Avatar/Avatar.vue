<script setup lang="ts">
// ** Local Imports
import type { AvatarProps, AvatarSlots } from "@/Components/Avatar";
import { useAvatar } from "@/Components/Avatar";
import { hasNamedSlot, resolveNamedSlot } from "@/Utils";

defineSlots<AvatarSlots>();

const props = defineProps<AvatarProps>();

const { slots, merged } = useAvatar(props, {
  size: "md",
  rounded: "full",
  color: "secondary",
});
</script>

<template>
  <div class="inline-flex shrink-0 items-center justify-center overflow-hidden">
    <component
      v-if="hasNamedSlot(slots, 'default')"
      :is="resolveNamedSlot(slots, 'default')"
    />

    <img
      :alt="merged.alt"
      :src="merged.src"
      v-else-if="merged.src"
      class="h-full w-full object-cover object-center"
    />

    <component
      v-else-if="hasNamedSlot(slots, 'fallback')"
      :is="resolveNamedSlot(slots, 'fallback')"
    />

    <span v-else-if="merged.fallback">
      {{ merged.fallback }}
    </span>
  </div>
</template>
