<script setup lang="ts">
// ** Local Imports
import { Icon } from "@/Components/Icon";
import { useToggle } from "@/Components/Toggle/composables/useToggle";
import type {
  ToggleOwnProps,
  ToggleSlots,
} from "@/Components/Toggle/toggle.types";

defineSlots<ToggleSlots>();

defineOptions({ inheritAttrs: false });

const props = defineProps<ToggleOwnProps>();

const { merged, iconSize, rootBind, startIconBind } = useToggle(props);
</script>

<template>
  <button v-bind="rootBind">
    <Icon
      :size="iconSize"
      v-bind="startIconBind"
      v-if="merged.startIcon"
      :icon="merged.startIcon"
    />

    <slot />
  </button>
</template>
