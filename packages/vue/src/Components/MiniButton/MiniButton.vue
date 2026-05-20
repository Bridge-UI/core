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
  iconBind,
  iconSize,
  isAnchor,
  isButton,
  rootBind,
  showIcon,
  rootClass,
  isDisabled,
  showSpinner,
  spinnerIcon,
  loadingIconBind,
  showDefaultSlot,
} = useMiniButton(props, {
  size: "md",
  as: "button",
  rounded: "md",
  variant: "flat",
  color: "primary",
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
