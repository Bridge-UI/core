<script setup lang="ts">
// ** Local Imports
import { useSidebarInset } from "@/Components/Sidebar/composables/useSidebarInset";
import type {
  SidebarInsetOwnProps,
  SidebarInsetSlots,
} from "@/Components/Sidebar/sidebar.types";

defineSlots<SidebarInsetSlots>();

defineOptions({ inheritAttrs: false, name: "SidebarInset" });

const props = defineProps<SidebarInsetOwnProps>();

const { rootBind } = useSidebarInset(props);
</script>

<template>
  <main v-bind="rootBind">
    <slot />
  </main>
</template>
