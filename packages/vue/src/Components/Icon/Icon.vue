<script setup lang="ts">
// ** Local Imports
import type { IconProps } from "@/Components/Icon";
import { useIcon } from "@/Components/Icon";

const props = defineProps<IconProps>();

const { merged, mergedClass } = useIcon(props, { size: "md" });
</script>

<template>
  <component :is="merged.icon" :class="mergedClass" />
</template>
