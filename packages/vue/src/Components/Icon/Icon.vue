<script setup lang="ts">
// ** External Imports
import { useAttrs } from "vue";

// ** Local Imports
import type { IconOwnProps } from "@/Components/Icon";
import { useIcon } from "@/Components/Icon";

const attrs = useAttrs();

defineOptions({ inheritAttrs: false });

const props = defineProps<IconOwnProps>();

const { merged, rootBind, mergedClass } = useIcon(props, attrs, { size: "md" });
</script>

<template>
  <component :is="merged.icon" :class="mergedClass" v-bind="rootBind" />
</template>
