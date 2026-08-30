<script setup lang="ts">
// ** Local Imports
import { useEmptyState } from "@/Components/EmptyState/composables/useEmptyState";
import type {
  EmptyStateOwnProps,
  EmptyStateSlots,
} from "@/Components/EmptyState/emptyState.types";
import { Icon } from "@/Components/Icon";
import { hasNamedSlot, hasSlotOrProp, isPropPresent } from "@/Utils";

defineSlots<EmptyStateSlots>();

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<EmptyStateOwnProps>(), {
  size: "md",
  titleAs: "p",
  align: "center",
  mediaDecorative: true,
});

const {
  slots,
  merged,
  iconBind,
  rootBind,
  titleBind,
  mediaBind,
  actionsBind,
  descriptionBind,
} = useEmptyState(props, {
  size: "md",
  titleAs: "p",
  align: "center",
  mediaDecorative: true,
});
</script>

<template>
  <div v-bind="rootBind">
    <div
      v-bind="mediaBind"
      v-if="hasNamedSlot(slots, 'media') || isPropPresent(merged.icon)"
    >
      <slot name="media" v-if="hasNamedSlot(slots, 'media')" />

      <Icon v-bind="iconBind" :icon="merged.icon" v-else-if="merged.icon" />
    </div>

    <component
      :is="merged.titleAs"
      v-bind="titleBind"
      v-if="hasSlotOrProp(slots, 'title', merged.title)"
    >
      <slot name="title" v-if="hasNamedSlot(slots, 'title')" />

      <template v-else-if="isPropPresent(merged.title)">
        {{ merged.title }}
      </template>
    </component>

    <div
      v-bind="descriptionBind"
      v-if="hasSlotOrProp(slots, 'description', merged.description)"
    >
      <slot name="description" v-if="hasNamedSlot(slots, 'description')" />

      <template v-else-if="isPropPresent(merged.description)">
        {{ merged.description }}
      </template>
    </div>

    <div
      v-bind="actionsBind"
      v-if="
        hasNamedSlot(slots, 'action') || hasNamedSlot(slots, 'secondaryAction')
      "
    >
      <slot name="action" />

      <slot name="secondaryAction" />
    </div>
  </div>
</template>
