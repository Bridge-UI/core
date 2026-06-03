<script setup lang="ts">
// ** External Imports
import { computed, useSlots } from "vue";

// ** Local Imports
import { useModal } from "@/Components/Modal/composables/useModal";
import type { ModalOwnProps, ModalSlots } from "@/Components/Modal/modal.types";
import { resolveNamedSlot } from "@/Utils";

defineSlots<ModalSlots>();

const slots = useSlots();

defineOptions({ inheritAttrs: false });

const props = defineProps<ModalOwnProps>();

const model = defineModel<boolean>({ default: false });

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
    blur: "none",
    align: "center",
    teleportTo: "body",
    closeOnEscape: true,
    closeOnOverlay: true,
  },
  {
    show: model,
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
    <div v-if="model" v-bind="rootBind">
      <div
        aria-hidden="true"
        v-bind="overlayBind"
        v-on:click="handleOverlayClick"
      />

      <div v-bind="wrapperBind" v-on:click="handleWrapperClick">
        <div v-bind="panelBind">
          <component :is="resolveNamedSlot(slots, 'default')" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
