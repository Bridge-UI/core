<script setup lang="ts">
// ** Local Imports
import type { AlertProps, AlertSlots } from "@/Components/Alert";
import { useAlert } from "@/Components/Alert";
import { Icon } from "@/Components/Icon";

defineSlots<AlertSlots>();

const props = defineProps<AlertProps>();

const {
  slots,
  merged,
  showIcon,
  direction,
  bodyClasses,
  iconClasses,
  rootClasses,
  resolvedIcon,
  showTitleRow,
  titleClasses,
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
  <div :dir="direction" :class="rootClasses">
    <slot v-if="slots.header" name="header" />

    <div v-else-if="showTitleRow" class="flex justify-between items-start">
      <div class="flex items-start gap-x-3">
        <template v-if="showIcon">
          <slot v-if="slots.icon" name="icon" />

          <Icon
            :icon="resolvedIcon"
            :class="iconClasses"
            v-else-if="resolvedIcon"
          />
        </template>

        <div :class="titleClasses">
          {{ merged.title }}
        </div>
      </div>

      <slot v-if="slots.action" name="action" />
    </div>

    <div v-if="hasDefaultBody" :class="bodyClasses">
      <slot />
    </div>

    <slot v-if="slots.footer" name="footer" />
  </div>
</template>
