<script setup lang="ts">
// ** External Imports
import { X } from "@lucide/vue";
import { computed, useSlots } from "vue";

// ** Local Imports
import type {
  ChipEmits,
  ChipOwnProps,
  ChipSlots,
} from "@/Components/Chip/chip.types";
import { useChip } from "@/Components/Chip/composables/useChip";
import { Icon, type IconProps } from "@/Components/Icon";
import { hasNamedSlot, resolveNamedSlot } from "@/Utils";

defineSlots<ChipSlots>();

defineOptions({ inheritAttrs: false });

const slots = useSlots();

const emit = defineEmits<ChipEmits>();

const props = withDefaults(defineProps<ChipOwnProps>(), {
  size: "md",
  disabled: false,
  dismissible: false,
  clearLabel: "Remove",
});

const {
  merged,
  rootBind,
  labelBind,
  clearBind,
  clearIconSize,
  handleDismiss,
  handleClearKeyDown,
} = useChip(props, { size: "md" }, emit);

const clearIconProps = computed(() => {
  return merged.value.customProps?.clearIcon;
});

const resolvedClearIconSize = computed(() => {
  return clearIconSize.value as IconProps["size"];
});

const hasContent = computed(() => {
  return hasNamedSlot(slots, "default") || Boolean(merged.value.label);
});
</script>

<template>
  <span v-bind="rootBind">
    <span v-if="hasContent" v-bind="labelBind">
      <component
        v-if="hasNamedSlot(slots, 'default')"
        :is="resolveNamedSlot(slots, 'default')"
      />

      <template v-else>{{ label }}</template>
    </span>

    <span
      v-if="dismissible"
      v-bind="clearBind"
      v-on:click="handleDismiss"
      v-on:keydown="handleClearKeyDown"
    >
      <Icon :icon="X" v-bind="clearIconProps" :size="resolvedClearIconSize" />
    </span>
  </span>
</template>
