<script setup lang="ts">
// ** External Imports
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { computed } from "vue";

// ** Local Imports
import type { IconProps } from "@/Components/Icon/icon.types";
import { sizeProps } from "@/Components/Icon/props/Size";

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
