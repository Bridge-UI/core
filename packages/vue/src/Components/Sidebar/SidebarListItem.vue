<script setup lang="ts">
// ** External Imports
import { computed, useAttrs, useSlots } from "vue";

// ** Local Imports
import ListItem from "@/Components/ListItem/ListItem.vue";
import type {
  ListItemOwnProps,
  ListItemSlots,
} from "@/Components/ListItem/listItem.types";
import { useSidebarListItem } from "@/Components/Sidebar/composables/useSidebarListItem";
import { hasNamedSlot } from "@/Utils";

defineSlots<ListItemSlots>();

defineOptions({ inheritAttrs: false });

const props = defineProps<ListItemOwnProps>();

const attrs = useAttrs();
const slots = useSlots();

const { tooltip: resolvedTooltip, tooltipPlacement: resolvedTooltipPlacement } =
  useSidebarListItem(props);

const listItemBind = computed(() => {
  const {
    tooltip: _tooltip,
    tooltipPlacement: _placement,
    ...itemProps
  } = props;

  return {
    ...attrs,
    ...itemProps,
    tooltip: resolvedTooltip.value,
    tooltipPlacement: resolvedTooltipPlacement.value,
  };
});
</script>

<template>
  <ListItem v-bind="listItemBind">
    <template #default v-if="hasNamedSlot(slots, 'default')">
      <slot />
    </template>

    <template #start v-if="hasNamedSlot(slots, 'start')">
      <slot name="start" />
    </template>

    <template #end v-if="hasNamedSlot(slots, 'end')">
      <slot name="end" />
    </template>

    <template #primary v-if="hasNamedSlot(slots, 'primary')">
      <slot name="primary" />
    </template>

    <template #secondary v-if="hasNamedSlot(slots, 'secondary')">
      <slot name="secondary" />
    </template>
  </ListItem>
</template>
