<script setup lang="ts">
// ** Local Imports
import type { AlertOwnProps, AlertSlots } from "@/Components/Alert/alert.types";
import { useAlert } from "@/Components/Alert/composables/useAlert";
import Icon from "@/Components/Icon/Icon.vue";
import { hasNamedSlot, hasSlotOrProp, isPropPresent } from "@/Utils";

defineSlots<AlertSlots>();

defineOptions({ inheritAttrs: false });

const props = defineProps<AlertOwnProps>();

const {
  slots,
  merged,
  bodyBind,
  iconBind,
  rootBind,
  titleBind,
  resolvedIcon,
  hasDefaultBody,
} = useAlert(props, {
  shadow: "sm",
  rounded: "sm",
  variant: "flat",
  color: "primary",
  padding: "medium",
});
</script>

<template>
  <div v-bind="rootBind">
    <slot name="header" v-if="hasNamedSlot(slots, 'header')" />

    <div
      class="flex justify-between items-start"
      v-else-if="hasSlotOrProp(slots, 'title', merged.title)"
    >
      <div class="flex items-start gap-x-3">
        <slot name="icon" v-if="hasNamedSlot(slots, 'icon')" />

        <Icon v-bind="iconBind" :icon="resolvedIcon" v-else-if="resolvedIcon" />

        <div v-bind="titleBind">
          <slot name="title" v-if="hasNamedSlot(slots, 'title')" />

          <template v-else-if="isPropPresent(merged.title)">
            {{ merged.title }}
          </template>
        </div>
      </div>

      <slot name="action" />
    </div>

    <div v-bind="bodyBind" v-if="hasDefaultBody">
      <slot />
    </div>

    <slot name="footer" />
  </div>
</template>
