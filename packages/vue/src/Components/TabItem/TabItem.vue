<script setup lang="ts">
// ** External Imports
import { useSlots } from "vue";

// ** Local Imports
import { useTabItem } from "@/Components/TabItem/composables/useTabItem";
import type {
  TabItemOwnProps,
  TabItemSlots,
} from "@/Components/TabItem/tabItem.types";

defineSlots<TabItemSlots>();

const slots = useSlots();

defineOptions({ name: "TabItem", inheritAttrs: false });

const props = defineProps<TabItemOwnProps>();

useTabItem(props, slots);
</script>

<template>
  <span hidden aria-hidden="true" />
</template>
