<script setup lang="ts">
// ** Local Imports
import { Drawer } from "@/Components/Drawer";
import { useFieldOverlay } from "@/Components/FieldOverlay/composables/useFieldOverlay";
import type {
  FieldOverlayEmits,
  FieldOverlayOwnProps,
  FieldOverlaySlots,
} from "@/Components/FieldOverlay/fieldOverlay.types";
import { Menu } from "@/Components/Menu";
import { Modal } from "@/Components/Modal";

defineSlots<FieldOverlaySlots>();

defineOptions({ inheritAttrs: false });

const emit = defineEmits<FieldOverlayEmits>();

const props = withDefaults(defineProps<FieldOverlayOwnProps>(), {
  overlay: "auto",
});

const model = defineModel<boolean>({ default: false });

const { menuBind, modalBind, drawerBind, resolvedOverlay } =
  useFieldOverlay(props);

function handleShowChange(show: boolean) {
  emit("show-change", show);
}

function handleClose() {
  emit("close");
}
</script>

<template>
  <Menu
    v-model="model"
    v-bind="menuBind"
    v-on:close="handleClose"
    v-if="resolvedOverlay === 'menu'"
    v-on:update:model-value="handleShowChange"
  >
    <slot />
  </Menu>

  <Modal
    v-model="model"
    v-bind="modalBind"
    v-on:close="handleClose"
    v-on:show-change="handleShowChange"
    v-else-if="resolvedOverlay === 'modal'"
  >
    <slot />
  </Modal>

  <Drawer
    v-else
    v-model="model"
    v-bind="drawerBind"
    v-on:close="handleClose"
    v-on:show-change="handleShowChange"
  >
    <slot />
  </Drawer>
</template>
