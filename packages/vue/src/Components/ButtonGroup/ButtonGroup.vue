<script setup lang="ts">
// ** Local Imports
import type {
  ButtonGroupOwnProps,
  ButtonGroupSlots,
} from "@/Components/ButtonGroup/buttonGroup.types";
import { useButtonGroup } from "@/Components/ButtonGroup/composables/useButtonGroup";

defineSlots<ButtonGroupSlots>();

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ButtonGroupOwnProps>(), {
  full: false,
  separator: true,
});

const { rootBind } = useButtonGroup(props, {
  full: false,
  color: "dark",
  separator: true,
  orientation: "horizontal",
});
</script>

<template>
  <div v-bind="rootBind">
    <slot />
  </div>
</template>
