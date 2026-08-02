<script setup lang="ts">
// ** Local Imports
import { useIcon } from "@/Components/Icon/composables/useIcon";
import type { IconOwnProps } from "@/Components/Icon/icon.types";

defineOptions({ inheritAttrs: false });

const props = defineProps<IconOwnProps>();

const { rootBind, resolvedIcon } = useIcon(props, { size: "md" });
</script>

<template>
  <component :is="resolvedIcon" v-bind="rootBind" v-if="resolvedIcon" />
</template>
