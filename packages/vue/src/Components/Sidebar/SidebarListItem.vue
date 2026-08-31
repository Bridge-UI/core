<script setup lang="ts">
// ** External Imports
import { computed, useAttrs, useSlots } from "vue";

// ** Core Imports
import { cn } from "@bridge-ui/core/Utils";

// ** Local Imports
import ListItem from "@/Components/ListItem/ListItem.vue";
import type {
  ListItemOwnProps,
  ListItemSlots,
} from "@/Components/ListItem/listItem.types";
import { useSidebarListItem } from "@/Components/Sidebar/composables/useSidebarListItem";
import type { SidebarListItemOwnProps } from "@/Components/Sidebar/sidebar.types";
import Tooltip from "@/Components/Tooltip/Tooltip.vue";
import { hasNamedSlot } from "@/Utils";

defineSlots<ListItemSlots>();

defineOptions({ inheritAttrs: false });

const props = defineProps<ListItemOwnProps & SidebarListItemOwnProps>();

const attrs = useAttrs();
const slots = useSlots();

const {
  itemClasses,
  accessibleName,
  tooltip: resolvedTooltip,
  tooltipPlacement: resolvedTooltipPlacement,
} = useSidebarListItem(props);

const listItemBind = computed(() => {
  const {
    classes,
    customProps,
    tooltip: _tooltip,
    tooltipPlacement: _placement,
    ...itemProps
  } = props;

  return {
    ...attrs,
    ...itemProps,
    ...(resolvedTooltip.value ? { as: "div" as const } : {}),
    customProps: {
      ...customProps,
      interactive: {
        ...(accessibleName.value ? { "aria-label": accessibleName.value } : {}),
        ...customProps?.interactive,
      },
    },
    classes: {
      ...classes,
      end: cn(itemClasses.value.end, classes?.end),
      start: cn(itemClasses.value.start, classes?.start),
      content: cn(itemClasses.value.content, classes?.content),
      interactive: cn(itemClasses.value.interactive, classes?.interactive),
    },
  };
});
</script>

<template>
  <li class="list-none" v-if="resolvedTooltip">
    <Tooltip
      :content="resolvedTooltip"
      :placement="resolvedTooltipPlacement"
      :classes="{ root: 'flex w-full min-w-0', trigger: 'flex w-full min-w-0' }"
    >
      <template #trigger>
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
    </Tooltip>
  </li>

  <ListItem v-else v-bind="listItemBind">
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
