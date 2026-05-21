<script setup lang="ts">
// ** Core Imports
import { cn } from "@bridge-ui/core";

const props = defineProps<{
  /**
   * Layout wrapper for `#start` slot content. Pass `class`, `rounded`, and
   * height utilities on `Button` (or other controls) yourself.
   */
  class?: string;
}>();
</script>

<template>
  <div :class="cn('flex h-full min-h-0 w-full items-stretch', props.class)">
    <slot />
  </div>
</template>
