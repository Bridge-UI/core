<script setup lang="ts">
// ** Local Imports
import { useText } from "@/Components/Text/composables/useText";
import type { TextOwnProps, TextSlots } from "@/Components/Text/text.types";

defineSlots<TextSlots>();

defineOptions({ inheritAttrs: false });

const props = defineProps<TextOwnProps>();

const { merged, rootBind } = useText(props, {
  as: "p",
  size: "md",
  color: "dark",
  weight: "normal",
  variant: "default",
});
</script>

<template>
  <component :is="merged.as" v-bind="rootBind">
    <slot />
  </component>
</template>
