<script setup lang="ts">
// ** Local Imports
import { useResizable } from "@/Components/Resizable/composables/useResizable";
import type {
  ResizableEmits,
  ResizableOwnProps,
  ResizableSlots,
} from "@/Components/Resizable/resizable.types";

defineSlots<ResizableSlots>();

defineOptions({ inheritAttrs: false });

const emit = defineEmits<ResizableEmits>();

const props = withDefaults(defineProps<ResizableOwnProps>(), {
  disabled: undefined,
});

const { rootRef, rootBind } = useResizable(
  props,
  {
    disabled: false,
    keyboardStep: 10,
    orientation: "horizontal",
  },
  emit,
);
</script>

<template>
  <div ref="rootRef" v-bind="rootBind">
    <slot />
  </div>
</template>
