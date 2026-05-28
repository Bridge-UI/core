// ** External Imports
import type { InjectionKey } from "vue";

// ** Local Imports
import type { BridgeUIContextApi } from "@/Provider/bridgeUITypes";

export const BRIDGE_UI_INJECTION_KEY: InjectionKey<BridgeUIContextApi> =
  Symbol.for("@bridge-ui/vue");
