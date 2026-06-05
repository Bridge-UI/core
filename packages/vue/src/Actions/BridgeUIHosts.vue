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
    modal?: {
      modal?: BridgeModalShellProps;
    };
    dialog?: {
      modal?: BridgeDialogShellProps;
    };
    snackbar?: {
      max?: number;
      timeout?: number | false;
      teleportTo?: string | false;
      position?: keyof SnackbarPosition;
      snackbar?: BridgeSnackbarShellProps;
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
