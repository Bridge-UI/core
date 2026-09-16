// ** External Imports
import { onUnmounted } from "vue";

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
 * Registers `api` until the current component unmounts.
 */
export function registerActionHost<T>(registry: ActionHostRegistry<T>, api: T) {
  const unregister = registry.register(api);

  onUnmounted(unregister);
}
