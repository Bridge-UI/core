<script setup lang="ts">
// ** Local Imports
import { useTabPanel } from "@/Components/TabPanel/composables/useTabPanel";
import type {
  TabPanelOwnProps,
  TabPanelSlots,
} from "@/Components/TabPanel/tabPanel.types";

defineSlots<TabPanelSlots>();

defineOptions({ inheritAttrs: false });

const props = defineProps<TabPanelOwnProps>();

const { rootBind, selected, keepMounted } = useTabPanel(props);
</script>

<template>
  <div v-bind="rootBind" v-if="selected || keepMounted">
    <slot />
  </div>
</template>
