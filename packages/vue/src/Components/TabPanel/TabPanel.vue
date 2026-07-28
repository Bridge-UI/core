<script setup lang="ts">
// ** External Imports
import { useSlots } from "vue";

// ** Local Imports
import { useTabPanel } from "@/Components/TabPanel/composables/useTabPanel";
import type {
  TabPanelOwnProps,
  TabPanelSlots,
} from "@/Components/TabPanel/tabPanel.types";
import { resolveNamedSlot } from "@/Utils";

defineSlots<TabPanelSlots>();

const slots = useSlots();

defineOptions({ inheritAttrs: false });

const props = defineProps<TabPanelOwnProps>();

const { rootBind, selected, keepMounted } = useTabPanel(props);
</script>

<template>
  <div v-bind="rootBind" v-if="selected || keepMounted">
    <component :is="resolveNamedSlot(slots, 'default')" />
  </div>
</template>
