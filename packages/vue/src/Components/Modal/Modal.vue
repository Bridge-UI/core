<script setup lang="ts">
// ** External Imports
import { computed, useSlots, watch } from "vue";

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
  persistent: false,
  teleportTo: "body",
  closeOnEscape: true,
  closeOnOverlay: true,
});

const model = defineModel<boolean>({ default: false });

const stackIdModel = defineModel<string | undefined>("stackId");

const {
  merged,
  rendered,
  rootBind,
  panelBind,
  overlayBind,
  wrapperBind,
  modalStackId,
} = useModal(
  props,
  {
    size: "md",
    blur: "none",
    align: "center",
    teleportTo: "body",
    transition: "none",
    closeOnEscape: true,
    closeOnOverlay: true,
  },
  {
    show: model,
    stackId: props.stackId,
    onClose: () => emit("close"),
    onShowChange: (show) => props.onShowChange?.(show),
  },
);

watch(modalStackId, (id) => {
  if (id) {
    stackIdModel.value = id;
  }
});

defineExpose({
  stackId: modalStackId,
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
</script>

<template>
  <Teleport :to="teleportTarget" :disabled="teleportDisabled">
    <div v-if="rendered" v-bind="rootBind">
      <div aria-hidden="true" v-bind="overlayBind" />

      <div v-bind="wrapperBind">
        <div v-bind="panelBind">
          <component :is="resolveNamedSlot(slots, 'default')" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
