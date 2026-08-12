<script setup lang="ts">
// ** Local Imports
import type { AlertOwnProps, AlertSlots } from "@/Components/Alert/alert.types";
import { useAlert } from "@/Components/Alert/composables/useAlert";
import Icon from "@/Components/Icon/Icon.vue";
import { hasNamedSlot, hasSlotOrProp, SlotOrProp } from "@/Utils";

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
    <SlotOrProp
      name="header"
      :slots="slots"
      v-if="hasNamedSlot(slots, 'header')"
    />

    <div
      class="flex justify-between items-start"
      v-else-if="hasSlotOrProp(slots, 'title', merged.title)"
    >
      <div class="flex items-start gap-x-3">
        <SlotOrProp
          name="icon"
          :slots="slots"
          v-if="hasNamedSlot(slots, 'icon')"
        />

        <Icon v-bind="iconBind" :icon="resolvedIcon" v-else-if="resolvedIcon" />

        <div v-bind="titleBind">
          <SlotOrProp name="title" :slots="slots" :fallback="merged.title" />
        </div>
      </div>

      <SlotOrProp name="action" :slots="slots" />
    </div>

    <div v-bind="bodyBind" v-if="hasDefaultBody">
      <SlotOrProp name="default" :slots="slots" />
    </div>

    <SlotOrProp name="footer" :slots="slots" />
  </div>
</template>
