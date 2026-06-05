// ** External Imports
import type { InjectionKey } from "vue";

// ** Local Imports
import type { BridgeModalController } from "@/Actions/Modal/bridgeModal.types";

export const BRIDGE_MODAL_INJECTION_KEY: InjectionKey<BridgeModalController> =
  Symbol.for("@bridge-ui/vue/bridge-modal");
