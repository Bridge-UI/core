// ** External Imports
import { inject } from "vue";

// ** Local Imports
import type { BridgeUIContextApi } from "@/Provider/bridgeUITypes";
import { BRIDGE_UI_INJECTION_KEY } from "@/Provider/injectionKey";

export function useBridgeUI(): BridgeUIContextApi | null {
  return inject(BRIDGE_UI_INJECTION_KEY, null);
}
