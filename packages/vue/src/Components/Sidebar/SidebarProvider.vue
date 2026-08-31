<script setup lang="ts">
// ** Local Imports
import { useSidebarProvider } from "@/Components/Sidebar/composables/useSidebarProvider";
import type {
  SidebarProviderEmits,
  SidebarProviderOwnProps,
  SidebarProviderSlots,
} from "@/Components/Sidebar/sidebar.types";

defineSlots<SidebarProviderSlots>();

const emit = defineEmits<SidebarProviderEmits>();

defineOptions({ inheritAttrs: false, name: "SidebarProvider" });

const props = withDefaults(defineProps<SidebarProviderOwnProps>(), {
  defaultOpen: true,
});

const open = defineModel<boolean | undefined>({ default: undefined });

const { rootBind } = useSidebarProvider(
  props,
  {
    defaultOpen: true,
  },
  open,
  emit,
);
</script>

<template>
  <div v-bind="rootBind">
    <slot />
  </div>
</template>
