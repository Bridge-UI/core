<script setup lang="ts">
// ** Local Imports
import type { AlertOwnProps, AlertSlots } from "@/Components/Alert/alert.types";
import { useAlert } from "@/Components/Alert/composables/useAlert";
import { Icon } from "@/Components/Icon";

defineSlots<AlertSlots>();

defineOptions({ inheritAttrs: false });

const props = defineProps<AlertOwnProps>();

const {
  merged,
  bodyBind,
  iconBind,
  rootBind,
  showIcon,
  titleBind,
  rootClasses,
  resolvedIcon,
  showIconSlot,
  showTitleRow,
  hasDefaultBody,
  showActionSlot,
  showFooterSlot,
  showHeaderSlot,
} = useAlert(props, {
  shadow: "sm",
  rounded: "sm",
  variant: "flat",
  color: "primary",
  padding: "medium",
});
</script>

<template>
  <div :class="rootClasses" v-bind="rootBind">
    <slot v-if="showHeaderSlot" name="header" />

    <div v-else-if="showTitleRow" class="flex justify-between items-start">
      <div class="flex items-start gap-x-3">
        <template v-if="showIcon">
          <slot v-if="showIconSlot" name="icon" />

          <Icon
            v-else-if="resolvedIcon"
            :icon="resolvedIcon"
            v-bind="iconBind"
          />
        </template>

        <div v-bind="titleBind">
          {{ merged.title }}
        </div>
      </div>

      <slot v-if="showActionSlot" name="action" />
    </div>

    <div v-if="hasDefaultBody" v-bind="bodyBind">
      <slot />
    </div>

    <slot v-if="showFooterSlot" name="footer" />
  </div>
</template>
