<script setup lang="ts">
// ** Local Imports
import { useToggleGroup } from "@/Components/ToggleGroup/composables/useToggleGroup";
import type {
  ToggleGroupEmits,
  ToggleGroupOwnProps,
  ToggleGroupSlots,
} from "@/Components/ToggleGroup/toggleGroup.types";

defineSlots<ToggleGroupSlots>();

const emit = defineEmits<ToggleGroupEmits>();

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ToggleGroupOwnProps>(), {
  full: false,
  disabled: false,
});

const model = defineModel<string>({ default: "" });

const { rootBind } = useToggleGroup(
  props,
  {
    size: "md",
    full: false,
    rounded: "md",
    disabled: false,
    variant: "solid",
    color: "primary",
    orientation: "horizontal",
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
