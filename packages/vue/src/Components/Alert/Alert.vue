<script setup lang="ts">
// ** External Imports
import { isNil } from "es-toolkit/compat";

// ** Local Imports
import type { AlertProps, AlertSlots } from "@/Components/Alert";
import { useAlert } from "@/Components/Alert";
import Icon from "@/Components/Icon";

defineSlots<AlertSlots>();

const props = defineProps<AlertProps>();

const {
  slots,
  merged,
  showIcon,
  bodyClasses,
  iconClasses,
  rootClasses,
  showTitleRow,
  titleClasses,
  hasDefaultBody,
} = useAlert(props, {
  shadow: "sm",
  rounded: "md",
  variant: "flat",
  color: "primary",
  padding: "medium",
});
</script>

<template>
  <div :class="rootClasses">
    <slot v-if="slots.header" name="header" />

    <div v-else-if="showTitleRow" class="flex justify-between items-start">
      <div class="flex items-start">
        <template v-if="showIcon">
          <slot v-if="slots.icon" name="icon" />

          <Icon
            :icon="merged.icon"
            :class="iconClasses"
            v-else-if="!isNil(merged.icon)"
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
