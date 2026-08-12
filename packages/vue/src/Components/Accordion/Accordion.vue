<script setup lang="ts">
// ** Core Imports
import type { AccordionValue } from "@bridge-ui/core";

// ** Local Imports
import type {
  AccordionEmits,
  AccordionOwnProps,
  AccordionSlots,
} from "@/Components/Accordion/accordion.types";
import { useAccordion } from "@/Components/Accordion/composables/useAccordion";

defineSlots<AccordionSlots>();

const emit = defineEmits<AccordionEmits>();

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<AccordionOwnProps>(), {
  disabled: false,
  multiple: false,
});

const model = defineModel<AccordionValue>({ default: "" });

const { rootBind } = useAccordion(
  props,
  {
    size: "md",
    multiple: false,
    disabled: false,
    color: "primary",
    variant: "default",
  },
  model,
  emit,
);
</script>

<template>
  <div v-bind="rootBind">
    <slot />
  </div>
</template>
