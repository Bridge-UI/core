<script setup lang="ts">
// ** Local Imports
import type { AlertOwnProps, AlertSlots } from "@/Components/Alert/alert.types";
import { useAlert } from "@/Components/Alert/composables/useAlert";
import { Icon } from "@/Components/Icon";

defineSlots<AlertSlots>();

defineOptions({ inheritAttrs: false });

const props = defineProps<AlertOwnProps>();

const {
  slots,
  merged,
  rootBind,
  showIcon,
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
  <div :class="rootClasses" v-bind="rootBind">
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
