<script setup lang="ts">
// ** External Imports
import { useSlots } from "vue";

// ** Local Imports
import { useTab } from "@/Components/Tab/composables/useTab";
import type { TabOwnProps, TabSlots } from "@/Components/Tab/tab.types";
import { resolveNamedSlot } from "@/Utils";

defineSlots<TabSlots>();

const slots = useSlots();

defineOptions({ inheritAttrs: false });

const props = defineProps<TabOwnProps>();

const { rootBind } = useTab(props);
</script>

<template>
  <button v-bind="rootBind">
    <component :is="resolveNamedSlot(slots, 'default')" />
  </button>
</template>
