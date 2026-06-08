<script setup lang="ts">
// ** External Imports
import { computed, inject, provide } from "vue";

// ** Local Imports
import type { BridgeDialogHostProps } from "@/Actions/Dialog/bridgeDialog.types";
import { BRIDGE_DIALOG_INJECTION_KEY } from "@/Actions/Dialog/bridgeDialogInjectionKey";
import BridgeDialogItem from "@/Actions/Dialog/BridgeDialogItem.vue";
import { createBridgeDialogApi } from "@/Actions/Dialog/createBridgeDialogApi";

const NESTED_HOST_WARNING =
  "[Bridge UI] Nested <BridgeDialogHost /> detected. useDialogAction() will target the nearest host only. Remove the extra host.";

const props = defineProps<BridgeDialogHostProps>();

const parentApi = inject(BRIDGE_DIALOG_INJECTION_KEY, null);

if (parentApi && process.env.NODE_ENV !== "production") {
  console.warn(NESTED_HOST_WARNING);
}

const api = createBridgeDialogApi();

const dialogEntries = computed(() => api.entries.value);

provide(BRIDGE_DIALOG_INJECTION_KEY, api);
</script>

<template>
  <slot />

  <BridgeDialogItem
    :api="api"
    :key="entry.id"
    :entry="entry"
    :host-modal="props.modal"
    v-for="entry in dialogEntries"
  />
</template>
