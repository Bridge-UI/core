<script setup lang="ts">
// ** External Imports
import { get } from "es-toolkit/compat";
import { computed } from "vue";

// ** Core Imports
import { cn } from "@bridge-ui/core";
import { sizeProps } from "@bridge-ui/core/Components/Icon/Size";

// ** Local Imports
import type { IconProps } from "@/Components/Icon/icon.types";

const props = withDefaults(defineProps<IconProps>(), {
  size: "md",
});

const mergedClass = computed(() => {
  return cn(get(sizeProps, props.size), props.class);
});
</script>

<template>
  <component :is="props.icon" :class="mergedClass" />
</template>
