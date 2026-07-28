<script setup lang="ts">
// ** External Imports
import { useSlots } from "vue";

// ** Local Imports
import { Icon } from "@/Components/Icon";
import { useTab } from "@/Components/Tab/composables/useTab";
import type { TabOwnProps, TabSlots } from "@/Components/Tab/tab.types";
import { hasNamedSlot, resolveNamedSlot } from "@/Utils";

defineSlots<TabSlots>();

const slots = useSlots();

defineOptions({ inheritAttrs: false });

const props = defineProps<TabOwnProps>();

const {
  merged,
  iconSize,
  rootBind,
  endIconBind,
  endSlotBind,
  startIconBind,
  startSlotBind,
} = useTab(props);
</script>

<template>
  <button v-bind="rootBind">
    <Icon
      :size="iconSize"
      v-bind="startIconBind"
      v-if="merged.startIcon"
      :icon="merged.startIcon"
    />

    <div v-bind="startSlotBind" v-else-if="hasNamedSlot(slots, 'start')">
      <component :is="resolveNamedSlot(slots, 'start')" />
    </div>

    <component :is="resolveNamedSlot(slots, 'default')" />

    <Icon
      :size="iconSize"
      v-bind="endIconBind"
      v-if="merged.endIcon"
      :icon="merged.endIcon"
    />

    <div v-bind="endSlotBind" v-else-if="hasNamedSlot(slots, 'end')">
      <component :is="resolveNamedSlot(slots, 'end')" />
    </div>
  </button>
</template>
