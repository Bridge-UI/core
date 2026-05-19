<script setup lang="ts">
// ** Local Imports
import type {
  ButtonOwnProps,
  ButtonSlots,
} from "@/Components/Button/button.types";
import { useButton } from "@/Components/Button/composables/useButton";
import { Icon } from "@/Components/Icon";

defineSlots<ButtonSlots>();

defineOptions({ inheritAttrs: false });

const props = defineProps<ButtonOwnProps>();

const {
  tag,
  merged,
  isAnchor,
  isButton,
  rootBind,
  showText,
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
  showDefaultSlot,
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
    v-bind="rootBind"
    :class="rootClass"
    :type="isButton ? 'button' : undefined"
    :disabled="isButton ? isDisabled : undefined"
    :aria-busy="merged.loading ? true : undefined"
    :aria-disabled="isDisabled && !isButton ? true : undefined"
    :href="isAnchor && !isDisabled && merged.href ? merged.href : undefined"
  >
    <Icon
      v-if="showSpinner"
      :icon="spinnerIcon"
      :size="merged.size"
      :class="spinnerIconClass"
    />

    <template v-else>
      <Icon
        :size="merged.size"
        :class="startIconClass"
        :icon="merged.startIcon"
        v-if="showStartIcon && merged.startIcon"
      />

      <div v-else-if="showStartSlot" class="inline-flex shrink-0 items-center">
        <slot name="start" />
      </div>

      <template v-if="showText">{{ merged.text }}</template>

      <slot v-else-if="showDefaultSlot" />

      <Icon
        :size="merged.size"
        :class="endIconClass"
        :icon="merged.endIcon"
        v-if="showEndIcon && merged.endIcon"
      />

      <div v-else-if="showEndSlot" class="inline-flex shrink-0 items-center">
        <slot name="end" />
      </div>
    </template>
  </component>
</template>
