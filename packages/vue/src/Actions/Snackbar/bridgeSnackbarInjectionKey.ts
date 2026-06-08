// ** External Imports
import type { InjectionKey } from "vue";

// ** Local Imports
import type { BridgeSnackbarController } from "@/Actions/Snackbar/bridgeSnackbar.types";

export const BRIDGE_SNACKBAR_INJECTION_KEY: InjectionKey<BridgeSnackbarController> =
  Symbol("bridgeSnackbar");
