<script setup lang="ts">
// ** External Imports
import { computed } from "vue";

// ** Local Imports
import { useEmptyState } from "@/Components/EmptyState/composables/useEmptyState";
import type {
  EmptyStateOwnProps,
  EmptyStateSlots,
} from "@/Components/EmptyState/emptyState.types";
import { Icon, type IconProps } from "@/Components/Icon";
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
  iconSize,
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

const hasMedia = computed(() => {
  return hasNamedSlot(slots, "media") || isPropPresent(merged.value.icon);
});

const hasActions = computed(() => {
  return (
    hasNamedSlot(slots, "action") || hasNamedSlot(slots, "secondaryAction")
  );
});

const resolvedIconSize = computed(() => {
  return iconSize.value as IconProps["size"];
});
</script>

<template>
  <div v-bind="rootBind">
    <div v-if="hasMedia" v-bind="mediaBind">
      <slot name="media" v-if="hasNamedSlot(slots, 'media')" />

      <Icon
        v-bind="iconBind"
        :icon="merged.icon"
        v-else-if="merged.icon"
        :size="resolvedIconSize"
      />
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

    <div v-if="hasActions" v-bind="actionsBind">
      <slot name="action" />

      <slot name="secondaryAction" />
    </div>
  </div>
</template>
