<script setup lang="ts">
// ** Local Imports
import type { BridgeUIHostsProps } from "@/Actions/bridgeUIHosts.types";
import { BridgeDialogHost } from "@/Actions/Dialog";
import { BridgeDrawerHost } from "@/Actions/Drawer";
import { BridgeModalHost } from "@/Actions/Modal";
import { BridgeSnackbarHost } from "@/Actions/Snackbar";

withDefaults(defineProps<BridgeUIHostsProps>(), {
  modal: () => ({}),
  dialog: () => ({}),
  drawer: () => ({}),
  snackbar: () => ({}),
});
</script>

<template>
  <BridgeModalHost v-bind="modal">
    <BridgeDrawerHost v-bind="drawer">
      <BridgeDialogHost v-bind="dialog">
        <BridgeSnackbarHost v-bind="snackbar">
          <slot />
        </BridgeSnackbarHost>
      </BridgeDialogHost>
    </BridgeDrawerHost>
  </BridgeModalHost>
</template>
