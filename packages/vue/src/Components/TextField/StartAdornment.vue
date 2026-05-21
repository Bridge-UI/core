<script setup lang="ts">
// ** Core Imports
import { cn } from "@bridge-ui/core";

const props = defineProps<{
  /**
   * Extra classes merged onto the inner wrapper (e.g. Button radius).
   */
  class?: string;
}>();

// prettier-ignore
const buttonChildClass = "[&_button]:h-full [&_button]:min-h-0 [&_button]:rounded-s-none [&_button]:rounded-e-none";
</script>

<template>
  <div
    :class="
      cn('flex h-full min-h-0 items-stretch', buttonChildClass, props.class)
    "
  >
    <slot />
  </div>
</template>
