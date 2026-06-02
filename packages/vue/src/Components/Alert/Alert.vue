<script setup lang="ts">
// ** Local Imports
import type { AlertOwnProps, AlertSlots } from "@/Components/Alert/alert.types";
import { useAlert } from "@/Components/Alert/composables/useAlert";
import Icon from "@/Components/Icon/Icon.vue";
import {
  hasNamedSlot,
  hasSlotOrProp,
  resolveNamedSlot,
  resolveSlotOrProp,
} from "@/Utils";

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
    <component
      v-if="hasNamedSlot(slots, 'header')"
      :is="resolveNamedSlot(slots, 'header')"
    />

    <div
      class="flex justify-between items-start"
      v-else-if="hasSlotOrProp(slots, 'title', merged.title)"
    >
      <div class="flex items-start gap-x-3">
        <template v-if="hasNamedSlot(slots, 'icon') || resolvedIcon">
          <component
            v-if="hasNamedSlot(slots, 'icon')"
            :is="resolveNamedSlot(slots, 'icon')"
          />

          <Icon
            v-bind="iconBind"
            :icon="resolvedIcon"
            v-else-if="resolvedIcon"
          />
        </template>

        <div v-bind="titleBind">
          <component :is="resolveSlotOrProp(slots, 'title', merged.title)" />
        </div>
      </div>

      <component :is="resolveNamedSlot(slots, 'action')" />
    </div>

    <div v-if="hasDefaultBody" v-bind="bodyBind">
      <component :is="resolveNamedSlot(slots, 'default')" />
    </div>

    <component :is="resolveNamedSlot(slots, 'footer')" />
  </div>
</template>
