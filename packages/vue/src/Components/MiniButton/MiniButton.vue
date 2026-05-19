<script setup lang="ts">
// ** Local Imports
import { Icon } from "@/Components/Icon";
import { useMiniButton } from "@/Components/MiniButton/composables/useMiniButton";
import type {
  MiniButtonOwnProps,
  MiniButtonSlots,
} from "@/Components/MiniButton/miniButton.types";

defineSlots<MiniButtonSlots>();

defineOptions({ inheritAttrs: false });

const props = defineProps<MiniButtonOwnProps>();

const {
  tag,
  merged,
  rootBind,
  iconSize,
  isAnchor,
  isButton,
  rootClass,
  showIcon,
  iconBind,
  isDisabled,
  showSpinner,
  showDefaultSlot,
  spinnerIcon,
  loadingIconBind,
} = useMiniButton(props, {
  as: "button",
  size: "md",
  rounded: "none",
  color: "primary",
  variant: "flat",
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
      <slot v-if="showDefaultSlot" />

      <Icon
        v-else-if="showIcon && merged.icon"
        :icon="merged.icon"
        :size="iconSize"
        v-bind="iconBind"
      />
    </template>
  </component>
</template>
