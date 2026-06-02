<script setup lang="ts">
// ** External Imports
import { computed, useSlots } from "vue";

// ** Local Imports
import { useModal } from "@/Components/Modal/composables/useModal";
import type { ModalOwnProps, ModalSlots } from "@/Components/Modal/modal.types";
import { resolveNamedSlot } from "@/Utils";

defineSlots<ModalSlots>();

defineOptions({ inheritAttrs: false });

const props = defineProps<ModalOwnProps>();

const show = defineModel<boolean>("show", { default: false });

const slots = useSlots();

const {
  merged,
  rootBind,
  panelBind,
  overlayBind,
  wrapperBind,
  handleOverlayClick,
  handleWrapperClick,
} = useModal(
  props,
  {
    size: "md",
    teleportTo: "body",
    closeOnEscape: true,
    closeOnOverlay: true,
  },
  {
    show,
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
  <Teleport :to="teleportTarget" :disabled="teleportDisabled">
    <div v-if="show" v-bind="rootBind">
      <div
        aria-hidden="true"
        v-bind="overlayBind"
        v-on:click="handleOverlayClick"
      />

      <div v-bind="wrapperBind" @click="handleWrapperClick">
        <div v-bind="panelBind">
          <component :is="resolveNamedSlot(slots, 'default')" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
