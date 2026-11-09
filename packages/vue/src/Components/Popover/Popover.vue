<script setup lang="ts">
// ** External Imports
import { computed, useSlots } from "vue";

// ** Local Imports
import { usePopover } from "@/Components/Popover/composables/usePopover";
import type {
  PopoverEmits,
  PopoverOwnProps,
  PopoverSlots,
} from "@/Components/Popover/popover.types";
import { hasNamedSlot } from "@/Utils";

defineSlots<PopoverSlots>();

const slots = useSlots();

const emit = defineEmits<PopoverEmits>();

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<PopoverOwnProps>(), {
  offset: 8,
  arrow: false,
  shadow: "md",
  rounded: "md",
  anchorEl: null,
  strategy: "fixed",
  persistent: false,
  matchWidth: false,
  teleportTo: "body",
  keepMounted: false,
  closeOnEscape: true,
  closeOnClickAway: true,
  disableAutoFocus: false,
  disableScrollLock: true,
  placement: "bottom-start",
});

const model = defineModel<boolean>({ default: false });

const {
  close,
  merged,
  mounted,
  hasTitle,
  rootBind,
  titleBind,
  arrowBind,
  triggerBind,
  contentBind,
  setArrowRef,
  setTriggerRef,
  setContentRef,
} = usePopover(
  props,
  {
    offset: 8,
    arrow: false,
    shadow: "md",
    rounded: "md",
    strategy: "fixed",
    teleportTo: "body",
    closeOnEscape: true,
    closeOnClickAway: true,
    disableScrollLock: true,
    placement: "bottom-start",
  },
  {
    show: model,
    onClose: () => emit("close"),
    hasTitleSlot: () => hasNamedSlot(slots, "title"),
    onShowChange: (show) => props.onShowChange?.(show),
  },
);

const teleportDisabled = computed(() => {
  return merged.value.teleportTo === false;
});

const teleportTarget = computed(() => {
  if (merged.value.teleportTo === false) {
    return "body";
  }

  return merged.value.teleportTo;
});
</script>

<template>
  <div v-bind="rootBind" v-if="hasNamedSlot(slots, 'trigger')">
    <div :ref="setTriggerRef" v-bind="triggerBind">
      <slot name="trigger" />
    </div>
  </div>

  <Teleport v-if="mounted" :to="teleportTarget" :disabled="teleportDisabled">
    <div :ref="setContentRef" v-bind="contentBind">
      <div v-if="hasTitle" v-bind="titleBind">
        <slot name="title">{{ merged.title }}</slot>
      </div>

      <slot :close="close" />

      <div v-if="arrowBind" :ref="setArrowRef" v-bind="arrowBind" />
    </div>
  </Teleport>
</template>
