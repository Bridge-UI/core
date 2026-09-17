// ** External Imports
import { useLayoutEffect } from "react";

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
 * Registers `api` for the lifetime of the current host.
 */
export function useRegisterActionHost<T>(
  registry: ActionHostRegistry<T>,
  api: T,
) {
  useLayoutEffect(() => {
    return registry.register(api);
  }, [api, registry]);
}
