<script setup lang="ts">
// ** Local Imports
import type {
  ButtonGroupTextOwnProps,
  ButtonGroupTextSlots,
} from "@/Components/ButtonGroup/buttonGroup.types";
import { useButtonGroupText } from "@/Components/ButtonGroup/composables/useButtonGroupText";

defineSlots<ButtonGroupTextSlots>();

defineOptions({ inheritAttrs: false });

const props = defineProps<ButtonGroupTextOwnProps>();

const { tag, rootBind } = useButtonGroupText(props, {
  as: "span",
});
</script>

<template>
  <component :is="tag" v-bind="rootBind">
    <slot />
  </component>
</template>
