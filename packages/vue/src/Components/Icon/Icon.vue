<script setup lang="ts">
// ** External Imports
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { computed } from "vue";

// ** Core Imports
import { sizeProps } from "@core/Components/Icon/Size";

// ** Local Imports
import type { IconProps } from "@/Components/Icon/icon.types";

const props = withDefaults(defineProps<IconProps>(), {
  size: "md",
});

const mergedClass = computed(() => {
  return twMerge(clsx(sizeProps[props.size], props.class));
});
</script>

<template>
  <component :is="props.icon" :class="mergedClass" />
</template>
