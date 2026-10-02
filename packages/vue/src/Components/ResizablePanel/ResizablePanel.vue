<script setup lang="ts">
// ** Local Imports
import { useResizablePanel } from "@/Components/ResizablePanel/composables/useResizablePanel";
import type {
  ResizablePanelEmits,
  ResizablePanelOwnProps,
  ResizablePanelSlots,
} from "@/Components/ResizablePanel/resizablePanel.types";

defineSlots<ResizablePanelSlots>();

defineOptions({ inheritAttrs: false });

const emit = defineEmits<ResizablePanelEmits>();

const props = withDefaults(defineProps<ResizablePanelOwnProps>(), {
  collapsible: undefined,
});

const collapsed = defineModel<boolean | undefined>("collapsed", {
  default: undefined,
});

const { rootBind, elementRef } = useResizablePanel(
  props,
  {
    minSize: 0,
    maxSize: 100,
    collapsedSize: 0,
    collapsible: false,
  },
  collapsed,
  emit,
);
</script>

<template>
  <div ref="elementRef" v-bind="rootBind">
    <slot />
  </div>
</template>
