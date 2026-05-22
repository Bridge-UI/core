<script setup lang="ts">
// ** Local Imports
import type { IconOwnProps } from "@/Components/Icon";
import { useIcon } from "@/Components/Icon";

defineOptions({ inheritAttrs: false });

const props = defineProps<IconOwnProps>();

const { merged, rootBind } = useIcon(props, { size: "md" });
</script>

<template>
  <component :is="merged.icon" v-bind="rootBind" />
</template>
