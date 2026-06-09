<script setup lang="ts">
// ** External Imports
import { computed, useSlots } from "vue";

// ** Local Imports
import { useMenu } from "@/Components/Menu/composables/useMenu";
import type {
  MenuEmits,
  MenuOwnProps,
  MenuSlots,
} from "@/Components/Menu/menu.types";
import { resolveNamedSlot } from "@/Utils";

defineSlots<MenuSlots>();

const slots = useSlots();

const emit = defineEmits<MenuEmits>();

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<MenuOwnProps>(), {
  offset: 4,
  shadow: "md",
  rounded: "md",
  anchorEl: null,
  strategy: "fixed",
  persistent: false,
  teleportTo: "body",
  keepMounted: false,
  closeOnEscape: true,
  closeOnClickAway: true,
  disableAutoFocus: false,
  placement: "bottom-start",
});

const model = defineModel<boolean>({ default: false });

const {
  merged,
  mounted,
  rootBind,
  hasTrigger,
  triggerBind,
  contentBind,
  setTriggerRef,
  setContentRef,
} = useMenu(
  props,
  {
    offset: 4,
    shadow: "md",
    rounded: "md",
    strategy: "fixed",
    teleportTo: "body",
    closeOnEscape: true,
    closeOnClickAway: true,
    placement: "bottom-start",
  },
  {
    show: model,
    onClose: () => emit("close"),
    onShowChange: (show) => props.onShowChange?.(show),
  },
  slots,
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
  <div v-if="hasTrigger" v-bind="rootBind">
    <div :ref="setTriggerRef" v-bind="triggerBind">
      <component :is="resolveNamedSlot(slots, 'trigger')" />
    </div>
  </div>

  <Teleport :to="teleportTarget" :disabled="teleportDisabled">
    <div v-if="mounted" :ref="setContentRef" v-bind="contentBind">
      <component :is="resolveNamedSlot(slots, 'default')" />
    </div>
  </Teleport>
</template>
