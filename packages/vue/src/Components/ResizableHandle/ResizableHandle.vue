<script setup lang="ts">
// ** Local Imports
import { useResizableHandle } from "@/Components/ResizableHandle/composables/useResizableHandle";
import type {
  ResizableHandleOwnProps,
  ResizableHandleSlots,
} from "@/Components/ResizableHandle/resizableHandle.types";

defineSlots<ResizableHandleSlots>();

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ResizableHandleOwnProps>(), {
  disabled: undefined,
  hideGrip: undefined,
});

const { gripBind, rootBind, showGrip, elementRef } = useResizableHandle(props, {
  disabled: false,
  hideGrip: false,
});
</script>

<template>
  <div ref="elementRef" v-bind="rootBind">
    <div v-if="showGrip" v-bind="gripBind">
      <slot name="grip" />
    </div>
  </div>
</template>
