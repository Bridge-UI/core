<script setup lang="ts">
// ** Local Imports
import { useHeading } from "@/Components/Heading/composables/useHeading";
import type {
  HeadingOwnProps,
  HeadingSlots,
} from "@/Components/Heading/heading.types";

defineSlots<HeadingSlots>();

defineOptions({ inheritAttrs: false });

const props = defineProps<HeadingOwnProps>();

const { rootTag, rootBind } = useHeading(props, {
  level: 2,
  color: "dark",
  weight: "semibold",
  variant: "default",
});
</script>

<template>
  <component :is="rootTag" v-bind="rootBind">
    <slot />
  </component>
</template>
