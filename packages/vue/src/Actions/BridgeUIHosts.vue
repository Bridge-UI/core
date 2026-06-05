<script setup lang="ts">
// ** Core Imports
import type { SnackbarPosition } from "@bridge-ui/core";

// ** Local Imports
import { BridgeModalHost } from "@/Actions/Modal";
import type { BridgeModalShellProps } from "@/Actions/Modal/bridgeModal.types";
import { BridgeSnackbarHost } from "@/Actions/Snackbar";
import type { BridgeSnackbarShellProps } from "@/Actions/Snackbar/bridgeSnackbar.types";

withDefaults(
  defineProps<{
    snackbar?: {
      teleportTo?: string | false;
      position?: keyof SnackbarPosition;
      snackbar?: BridgeSnackbarShellProps;
    };
    modal?: {
      modal?: BridgeModalShellProps;
    };
  }>(),
  {
    snackbar: () => ({}),
    modal: () => ({}),
  },
);
</script>

<template>
  <BridgeSnackbarHost v-bind="snackbar">
    <BridgeModalHost v-bind="modal">
      <slot />
    </BridgeModalHost>
  </BridgeSnackbarHost>
</template>
