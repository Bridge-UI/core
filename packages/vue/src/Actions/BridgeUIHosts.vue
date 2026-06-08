<script setup lang="ts">
// ** Local Imports
import type { BridgeUIHostsProps } from "@/Actions/bridgeUIHosts.types";
import { BridgeDialogHost } from "@/Actions/Dialog";
import { BridgeModalHost } from "@/Actions/Modal";
import { BridgeSnackbarHost } from "@/Actions/Snackbar";

withDefaults(defineProps<BridgeUIHostsProps>(), {
  modal: () => ({}),
  dialog: () => ({}),
  snackbar: () => ({}),
});
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
