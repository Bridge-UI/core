<script setup lang="ts">
// ** Core Imports
import type { SnackbarPosition } from "@bridge-ui/core";

// ** Local Imports
import { BridgeDialogHost } from "@/Actions/Dialog";
import type { BridgeDialogShellProps } from "@/Actions/Dialog/bridgeDialog.types";
import { BridgeModalHost } from "@/Actions/Modal";
import type { BridgeModalShellProps } from "@/Actions/Modal/bridgeModal.types";
import { BridgeSnackbarHost } from "@/Actions/Snackbar";
import type { BridgeSnackbarShellProps } from "@/Actions/Snackbar/bridgeSnackbar.types";

withDefaults(
  defineProps<{
    dialog?: {
      modal?: BridgeDialogShellProps;
    };
    modal?: {
      modal?: BridgeModalShellProps;
    };
    snackbar?: {
      max?: number;
      position?: keyof SnackbarPosition;
      snackbar?: BridgeSnackbarShellProps;
      teleportTo?: string | false;
      timeout?: number | false;
    };
  }>(),
  {
    modal: () => ({}),
    dialog: () => ({}),
    snackbar: () => ({}),
  },
);
</script>

<template>
  <BridgeModalHost v-bind="modal">
    <BridgeDialogHost v-bind="dialog">
      <BridgeSnackbarHost v-bind="snackbar">
        <slot />
      </BridgeSnackbarHost>
    </BridgeDialogHost>
  </BridgeModalHost>
</template>
