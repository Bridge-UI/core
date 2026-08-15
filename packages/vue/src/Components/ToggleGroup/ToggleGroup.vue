<script setup lang="ts">
// ** Core Imports
import type { ToggleGroupValue } from "@bridge-ui/core";

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
  multiple: false,
});

const model = defineModel<ToggleGroupValue>({ default: "" });

const { rootBind } = useToggleGroup(
  props,
  {
    size: "md",
    full: false,
    rounded: "md",
    disabled: false,
    multiple: false,
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
