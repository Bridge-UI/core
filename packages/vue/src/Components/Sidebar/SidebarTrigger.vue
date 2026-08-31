<script setup lang="ts">
// ** External Imports
import { useSlots } from "vue";

// ** Local Imports
import { Button } from "@/Components/Button";
import { useSidebarTrigger } from "@/Components/Sidebar/composables/useSidebarTrigger";
import type {
  SidebarTriggerOwnProps,
  SidebarTriggerSlots,
} from "@/Components/Sidebar/sidebar.types";

defineSlots<SidebarTriggerSlots>();

defineOptions({ inheritAttrs: false });

defineProps<SidebarTriggerOwnProps>();

const slots = useSlots();

const {
  attrs,
  panelId,
  expanded,
  iconClass,
  ariaLabel,
  handleClick,
  hasDefaultSlot,
} = useSidebarTrigger(slots);
</script>

<template>
  <Button
    v-bind="attrs"
    color="dark"
    type="button"
    density="mini"
    variant="light"
    :aria-label="ariaLabel"
    v-on:click="handleClick"
    :aria-expanded="expanded"
    :classes="{ icon: iconClass }"
    :aria-controls="panelId || undefined"
    :icon="hasDefaultSlot ? undefined : 'panelLeft'"
  >
    <slot v-if="hasDefaultSlot" />
  </Button>
</template>
