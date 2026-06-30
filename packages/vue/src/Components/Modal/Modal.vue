<script setup lang="ts">
// ** External Imports
import { computed, useSlots } from "vue";

// ** Local Imports
import { useModal } from "@/Components/Modal/composables/useModal";
import type {
  ModalEmits,
  ModalOwnProps,
  ModalSlots,
} from "@/Components/Modal/modal.types";
import { resolveNamedSlot } from "@/Utils";

defineSlots<ModalSlots>();

const slots = useSlots();

const emit = defineEmits<ModalEmits>();

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ModalOwnProps>(), {
  scroll: "body",
  autoFocus: false,
  persistent: false,
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
} = useModal(
  props,
  {
    size: "md",
    blur: "none",
    scroll: "body",
    autoFocus: false,
    teleportTo: "body",
    transition: "fade",
    closeOnEscape: true,
    closeOnOverlay: true,
    align: "middle-center",
  },
  {
    show: model,
    stackId: props.stackId,
    onClose: () => emit("close"),
    onShowChange: (show) => emit("show-change", show),
  },
);

defineExpose({
  stackId: computed(() => props.stackId ?? layerStackId.value),
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
