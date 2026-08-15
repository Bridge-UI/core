<script setup lang="ts">
// ** Local Imports
import { Icon } from "@/Components/Icon";
import { useToggleItem } from "@/Components/ToggleItem/composables/useToggleItem";
import type {
  ToggleItemOwnProps,
  ToggleItemSlots,
} from "@/Components/ToggleItem/toggleItem.types";

defineSlots<ToggleItemSlots>();

defineOptions({ inheritAttrs: false });

const props = defineProps<ToggleItemOwnProps>();

const { merged, iconSize, rootBind, startIconBind } = useToggleItem(props);
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
