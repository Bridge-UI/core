// ** External Imports
import { onBeforeMount, onUnmounted } from "vue";

// ** Core Imports
import {
  createActionHostRegistry,
  type ActionHostRegistry,
} from "@bridge-ui/core/Layer";

// ** Local Imports
import type { BridgeDialogController } from "@/Actions/Dialog/bridgeDialog.types";
import type { BridgeDrawerController } from "@/Actions/Drawer/bridgeDrawer.types";
import type { BridgeModalController } from "@/Actions/Modal/bridgeModal.types";
import type { BridgeSnackbarController } from "@/Actions/Snackbar/bridgeSnackbar.types";

export const dialogActionHosts =
  createActionHostRegistry<BridgeDialogController>();

export const drawerActionHosts =
  createActionHostRegistry<BridgeDrawerController>();

export const modalActionHosts =
  createActionHostRegistry<BridgeModalController>();

export const snackbarActionHosts =
  createActionHostRegistry<BridgeSnackbarController>();

/**
 * Registers `api` while the current component is mounted. Lifecycle hooks
 * never run during SSR, so server renders don't leak hosts into the registry.
 */
export function registerActionHost<T>(registry: ActionHostRegistry<T>, api: T) {
  let unregister: null | (() => void) = null;

  onBeforeMount(() => {
    unregister = registry.register(api);
  });

  onUnmounted(() => {
    unregister?.();
  });
}
