<script setup lang="ts">
// ** Local Imports
import { useStepper } from "@/Components/Stepper/composables/useStepper";
import type {
  StepperEmits,
  StepperOwnProps,
  StepperSlots,
} from "@/Components/Stepper/stepper.types";

defineSlots<StepperSlots>();

const emit = defineEmits<StepperEmits>();

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<StepperOwnProps>(), {
  linear: true,
});

const model = defineModel<number>({ default: 0 });

const { listBind, rootBind } = useStepper(
  props,
  {
    size: "md",
    linear: true,
    color: "primary",
    orientation: "horizontal",
  },
  model,
  emit,
);
</script>

<template>
  <nav v-bind="rootBind">
    <ol v-bind="listBind">
      <slot />
    </ol>
  </nav>
</template>
