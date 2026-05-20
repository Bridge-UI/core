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
  iconSize,
  showText,
  rootClass,
  iconBind,
  isDisabled,
  showIcon,
  endIconBind,
  endSlotBind,
  showEndIcon,
  showEndSlot,
  showSpinner,
  spinnerIcon,
  showStartIcon,
  showStartSlot,
  startIconBind,
  startSlotBind,
  showDefaultSlot,
  showDefaultSlotMini,
  loadingIconBind,
} = useButton(props, {
  size: "md",
  as: "button",
  rounded: "md",
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
      :size="iconSize"
      v-bind="loadingIconBind"
    />

    <template v-else>
      <slot v-if="showDefaultSlotMini" />

      <Icon
        v-else-if="showIcon && merged.icon"
        :icon="merged.icon"
        :size="iconSize"
        v-bind="iconBind"
      />

      <Icon
        v-if="showStartIcon && merged.startIcon"
        :icon="merged.startIcon"
        :size="merged.size"
        v-bind="startIconBind"
      />

      <div v-else-if="showStartSlot" v-bind="startSlotBind">
        <slot name="start" />
      </div>

      <template v-if="showText">{{ merged.text }}</template>

      <slot v-else-if="showDefaultSlot" />

      <Icon
        v-if="showEndIcon && merged.endIcon"
        :icon="merged.endIcon"
        :size="merged.size"
        v-bind="endIconBind"
      />

      <div v-else-if="showEndSlot" v-bind="endSlotBind">
        <slot name="end" />
      </div>
    </template>
  </component>
</template>
