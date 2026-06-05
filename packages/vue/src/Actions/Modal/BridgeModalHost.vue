<script setup lang="ts">
// ** External Imports
import { computed, inject, provide } from "vue";

// ** Local Imports
import type { BridgeModalEntry } from "@/Actions/Modal/bridgeModal.types";
import { BRIDGE_MODAL_INJECTION_KEY } from "@/Actions/Modal/bridgeModalInjectionKey";
import { createBridgeModalApi } from "@/Actions/Modal/createBridgeModalApi";
import { Modal } from "@/Components/Modal";

const NESTED_HOST_WARNING =
  "[Bridge UI] Nested <BridgeModalHost /> detected. useBridgeModal() will target the nearest host only. Remove the extra host or rely on <BridgeUIProvider />.";

const parentApi = inject(BRIDGE_MODAL_INJECTION_KEY, null);

if (parentApi && process.env.NODE_ENV !== "production") {
  console.warn(NESTED_HOST_WARNING);
}

const api = createBridgeModalApi();

const modalEntries = computed(() => api.entries.value);

provide(BRIDGE_MODAL_INJECTION_KEY, api);

function handleDismiss(entry: BridgeModalEntry) {
  if (!entry.show) {
    return;
  }

  entry.onClose?.();
}

function handleShowChange(entry: BridgeModalEntry, show: boolean) {
  if (show) {
    return;
  }

  api.removeEntry(entry.id);
  entry.onClosed?.();
}
</script>

<template>
  <slot />

  <Modal
    :key="entry.id"
    v-bind="entry.modal"
    v-model="entry.show"
    :stack-id="entry.id"
    v-for="entry in modalEntries"
    v-on:close="handleDismiss(entry)"
    :on-show-change="(show) => handleShowChange(entry, show)"
  >
    <component :is="entry.component" v-bind="entry.props" />
  </Modal>
</template>
