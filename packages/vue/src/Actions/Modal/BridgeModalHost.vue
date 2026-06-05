<script setup lang="ts">
// ** External Imports
import { provide } from "vue";

// ** Local Imports
import type { BridgeModalEntry } from "@/Actions/Modal/bridgeModal.types";
import { BRIDGE_MODAL_INJECTION_KEY } from "@/Actions/Modal/bridgeModalInjectionKey";
import { createBridgeModalApi } from "@/Actions/Modal/createBridgeModalApi";
import { Modal } from "@/Components/Modal";

const api = createBridgeModalApi();

const { entries } = api;

provide(BRIDGE_MODAL_INJECTION_KEY, api);

function handleShowChange(entry: BridgeModalEntry, show: boolean) {
  if (show) {
    return;
  }

  entry.onClose?.();
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
    v-for="entry in entries"
    v-on:update:model-value="handleShowChange(entry, $event)"
  >
    <component :is="entry.component" v-bind="entry.props" />
  </Modal>
</template>
