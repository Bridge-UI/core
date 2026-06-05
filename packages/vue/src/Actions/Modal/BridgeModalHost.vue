<script setup lang="ts">
// ** External Imports
import {
  completeLayerHide,
  invokeLayerDismiss,
  mergeLayerShellProps,
} from "@bridge-ui/core";
import { computed, inject, provide } from "vue";

// ** Local Imports
import type { BridgeModalShellProps } from "@/Actions/Modal/bridgeModal.types";
import { BRIDGE_MODAL_INJECTION_KEY } from "@/Actions/Modal/bridgeModalInjectionKey";
import { createBridgeModalApi } from "@/Actions/Modal/createBridgeModalApi";
import { Modal } from "@/Components/Modal";

const props = defineProps<{
  /**
   * Default shell options merged into every modal opened via `useModalAction()`.
   * Per-call `open({ modal })` overrides these.
   */
  modal?: BridgeModalShellProps;
}>();

const NESTED_HOST_WARNING =
  "[Bridge UI] Nested <BridgeModalHost /> detected. useModalAction() will target the nearest host only. Remove the extra host.";

const parentApi = inject(BRIDGE_MODAL_INJECTION_KEY, null);

if (parentApi && process.env.NODE_ENV !== "production") {
  console.warn(NESTED_HOST_WARNING);
}

const api = createBridgeModalApi();

const modalEntries = computed(() => api.entries.value);

provide(BRIDGE_MODAL_INJECTION_KEY, api);
</script>

<template>
  <slot />

  <Modal
    :key="entry.id"
    v-bind="mergeLayerShellProps(props.modal, entry.modal)"
    :stack-id="entry.id"
    :model-value="entry.show"
    v-for="entry in modalEntries"
    v-on:close="invokeLayerDismiss(api.entries.value, entry.id)"
    v-on:update:model-value="api.syncShow(entry.id, $event)"
    :on-show-change="
      (show) =>
        completeLayerHide(api.entries.value, entry.id, show, api.removeEntry)
    "
  >
    <component :is="entry.component" v-bind="entry.props" />
  </Modal>
</template>
