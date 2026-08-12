<script setup lang="ts">
// ** Local Imports
import { useTabList } from "@/Components/TabList/composables/useTabList";
import type {
  TabListOwnProps,
  TabListSlots,
} from "@/Components/TabList/tabList.types";

defineSlots<TabListSlots>();

defineOptions({ inheritAttrs: false });

const props = defineProps<TabListOwnProps>();

const { rootBind } = useTabList(props);
</script>

<template>
  <div v-bind="rootBind">
    <slot />
  </div>
</template>
