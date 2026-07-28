<script setup lang="ts">
// ** External Imports
import { computed, useSlots } from "vue";

// ** Local Imports
import { useDrawer } from "@/Components/Drawer/composables/useDrawer";
import type {
  DrawerEmits,
  DrawerOwnProps,
  DrawerSlots,
} from "@/Components/Drawer/drawer.types";
import { resolveNamedSlot } from "@/Utils";

defineSlots<DrawerSlots>();

const slots = useSlots();

const emit = defineEmits<DrawerEmits>();

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DrawerOwnProps>(), {
  scroll: "paper",
  autoFocus: false,
  persistent: false,
  placement: "left",
  keepMounted: false,
  teleportTo: "body",
  hideBackdrop: false,
  closeOnEscape: true,
  closeOnOverlay: true,
  disableScrollLock: false,
  disableEnforceFocus: false,
  disableRestoreFocus: false,
});

const model = defineModel<boolean>({ default: false });

const {
  merged,
  mounted,
  rootBind,
  panelBind,
  overlayBind,
  wrapperBind,
  setPanelRef,
  layerStackId,
} = useDrawer(
  props,
  {
    size: "md",
    blur: "none",
    scroll: "paper",
    autoFocus: false,
    placement: "left",
    teleportTo: "body",
    transition: "slide",
    closeOnEscape: true,
    closeOnOverlay: true,
  },
  {
    show: model,
    stackId: props.stackId,
    onClose: () => emit("close"),
    onShowChange: (show) => emit("show-change", show),
  },
);

defineExpose({
  stackId: computed(() => {
    return props.stackId ?? layerStackId.value;
  }),
});

const teleportDisabled = computed(() => {
  return merged.value.teleportTo === false;
});

const teleportTarget = computed(() => {
  if (merged.value.teleportTo === false) {
    return "body";
  }

  return merged.value.teleportTo;
});

const showBackdrop = computed(() => {
  return props.hideBackdrop !== true && merged.value.hideBackdrop !== true;
});
</script>

<template>
  <Teleport :to="teleportTarget" :disabled="teleportDisabled">
    <div v-if="mounted" v-bind="rootBind">
      <div aria-hidden="true" v-if="showBackdrop" v-bind="overlayBind" />

      <div v-bind="wrapperBind">
        <div :ref="setPanelRef" v-bind="panelBind">
          <component :is="resolveNamedSlot(slots, 'default')" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
