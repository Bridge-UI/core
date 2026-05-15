<script setup lang="ts">
// ** Local Imports
import { useButton } from "@/Components/Button";
import type {
  ButtonProps,
  ButtonSlots,
} from "@/Components/Button/button.types";
import Icon from "@/Components/Icon";

defineSlots<ButtonSlots>();

const props = defineProps<ButtonProps>();

const {
  tag,
  merged,
  isAnchor,
  isButton,
  direction,
  rootClass,
  isDisabled,
  showEndIcon,
  showEndSlot,
  showSpinner,
  spinnerIcon,
  endIconClass,
  showStartIcon,
  showStartSlot,
  startIconClass,
  spinnerIconClass,
} = useButton(props, {
  size: "md",
  as: "button",
  rounded: "sm",
  color: "primary",
  variant: "solid",
});
</script>

<template>
  <component
    :is="tag"
    :dir="direction"
    :class="rootClass"
    :type="isButton ? 'button' : undefined"
    :disabled="isButton ? isDisabled : undefined"
    :aria-busy="merged.loading ? true : undefined"
    :aria-disabled="isDisabled && !isButton ? true : undefined"
    :href="isAnchor && !isDisabled && merged.href ? merged.href : undefined"
  >
    <Icon
      :size="merged.size"
      :class="startIconClass"
      :icon="merged.startIcon"
      v-if="showStartIcon && merged.startIcon"
    />

    <div v-else-if="showStartSlot" class="inline-flex shrink-0 items-center">
      <slot name="start" />
    </div>

    <slot />

    <Icon
      :size="merged.size"
      :class="endIconClass"
      :icon="merged.endIcon"
      v-if="showEndIcon && merged.endIcon"
    />

    <div v-else-if="showEndSlot" class="inline-flex shrink-0 items-center">
      <slot name="end" />
    </div>

    <Icon
      v-if="showSpinner"
      :icon="spinnerIcon"
      :size="merged.size"
      :class="spinnerIconClass"
    />
  </component>
</template>
