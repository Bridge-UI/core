<script setup lang="ts">
// ** Local Imports
import { BridgeDialogHost } from "@/Actions/Dialog";
import type { BridgeDialogShellProps } from "@/Actions/Dialog/bridgeDialog.types";
import { BridgeModalHost } from "@/Actions/Modal";
import type { BridgeModalShellProps } from "@/Actions/Modal/bridgeModal.types";
import { BridgeSnackbarHost } from "@/Actions/Snackbar";
import type { BridgeSnackbarShellProps } from "@/Actions/Snackbar/bridgeSnackbar.types";

withDefaults(
  defineProps<{
    snackbar?: {
      snackbar?: BridgeSnackbarShellProps;
      max?: number;
      timeout?: number | false;
    };
    dialog?: {
      modal?: BridgeDialogShellProps;
    };
    modal?: {
      modal?: BridgeModalShellProps;
    };
  }>(),
  {
    snackbar: () => ({}),
    dialog: () => ({}),
    modal: () => ({}),
  },
);
</script>

<template>
  <BridgeSnackbarHost v-bind="snackbar">
    <BridgeDialogHost v-bind="dialog">
      <BridgeModalHost v-bind="modal">
        <slot />
      </BridgeModalHost>
    </BridgeDialogHost>
  </BridgeSnackbarHost>
</template>
