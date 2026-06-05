// ** External Imports
import type { InjectionKey } from "vue";

// ** Local Imports
import type { BridgeDialogController } from "@/Actions/Dialog/bridgeDialog.types";

export const BRIDGE_DIALOG_INJECTION_KEY: InjectionKey<BridgeDialogController> =
  Symbol("bridge-dialog");
