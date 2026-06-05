<script setup lang="ts">
// ** External Imports
import { inject, provide } from "vue";

// ** Local Imports
import type { BridgeSnackbarShellProps } from "@/Actions/Snackbar/bridgeSnackbar.types";
import { BRIDGE_SNACKBAR_INJECTION_KEY } from "@/Actions/Snackbar/bridgeSnackbarInjectionKey";
import BridgeSnackbarItem from "@/Actions/Snackbar/BridgeSnackbarItem.vue";
import { createBridgeSnackbarApi } from "@/Actions/Snackbar/createBridgeSnackbarApi";

const NESTED_HOST_WARNING =
  "[Bridge UI] Nested <BridgeSnackbarHost /> detected. useBridgeSnackbar() will target the nearest host only. Remove the extra host.";

const props = defineProps<{
  /**
   * Default shell options merged into every snackbar opened via `useBridgeSnackbar()`.
   * Per-call `open()` options override these.
   */
  snackbar?: BridgeSnackbarShellProps;
  /**
   * Maximum open snackbars. When exceeded, the oldest closes before opening the new one.
   */
  max?: number;
  /**
   * Default auto-dismiss delay (ms). `false` keeps snackbars open until dismissed.
   *
   * @default 5000
   */
  timeout?: number | false;
}>();

const parentApi = inject(BRIDGE_SNACKBAR_INJECTION_KEY, null);

if (parentApi && process.env.NODE_ENV !== "production") {
  console.warn(NESTED_HOST_WARNING);
}

const api = createBridgeSnackbarApi({
  max: props.max,
  timeout: props.timeout,
});

provide(BRIDGE_SNACKBAR_INJECTION_KEY, api);
</script>

<template>
  <slot />

  <BridgeSnackbarItem
    :key="entry.id"
    v-for="entry in api.entries.value"
    :api="api"
    :entry="entry"
    :host-snackbar="props.snackbar"
  />
</template>
