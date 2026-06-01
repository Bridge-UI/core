<script setup lang="ts">
// ** Local Imports
import { useIcon } from "@/Components/Icon/composables/useIcon";
import type { IconOwnProps } from "@/Components/Icon/icon.types";

defineOptions({ inheritAttrs: false });

const props = defineProps<IconOwnProps>();

const { merged, rootBind } = useIcon(props, { size: "md" });
</script>

<template>
  <component :is="merged.icon" v-bind="rootBind" />
</template>
