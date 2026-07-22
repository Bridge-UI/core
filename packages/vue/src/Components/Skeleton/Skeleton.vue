<script setup lang="ts">
// ** Local Imports
import { useSkeleton } from "@/Components/Skeleton/composables/useSkeleton";
import type { SkeletonOwnProps } from "@/Components/Skeleton/skeleton.types";

defineOptions({ inheritAttrs: false });

const props = defineProps<SkeletonOwnProps>();

const { rootBind } = useSkeleton(props, {
  rounded: "md",
});
</script>

<template>
  <div v-bind="rootBind" />
</template>
