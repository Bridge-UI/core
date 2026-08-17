<script setup lang="ts">
// ** External Imports
import { computed, useSlots } from "vue";

// ** Local Imports
import { useTooltip } from "@/Components/Tooltip/composables/useTooltip";
import type {
  TooltipEmits,
  TooltipOwnProps,
  TooltipSlots,
} from "@/Components/Tooltip/tooltip.types";
import { hasNamedSlot, isPropPresent } from "@/Utils";

defineSlots<TooltipSlots>();

const slots = useSlots();

const emit = defineEmits<TooltipEmits>();

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TooltipOwnProps>(), {
  offset: 8,
  size: "md",
  arrow: true,
  color: "dark",
  rounded: "md",
  closeDelay: 0,
  openDelay: 200,
  anchorEl: null,
  disabled: false,
  placement: "top",
  strategy: "fixed",
  teleportTo: "body",
});

const model = defineModel<boolean>({ default: false });

const {
  merged,
  mounted,
  rootBind,
  arrowBind,
  triggerBind,
  contentBind,
  setArrowRef,
  setTriggerRef,
  setContentRef,
} = useTooltip(
  props,
  {
    offset: 8,
    size: "md",
    arrow: true,
    color: "dark",
    rounded: "md",
    closeDelay: 0,
    openDelay: 200,
    placement: "top",
    strategy: "fixed",
    teleportTo: "body",
  },
  {
    show: model,
    onShowChange: (show) => {
      props.onShowChange?.(show);
      emit("show-change", show);
    },
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
      <slot v-if="hasNamedSlot(slots, 'default')" />

      <template v-else-if="isPropPresent(merged.content)">
        {{ merged.content }}
      </template>

      <div v-if="arrowBind" :ref="setArrowRef" v-bind="arrowBind" />
    </div>
  </Teleport>
</template>
