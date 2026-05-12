// ** External Imports
import { isNil } from "es-toolkit/compat";
import { inject } from "vue";

// ** Local Imports
import type { BridgeUIContextApi } from "@/Provider/bridgeUITypes";
import { BRIDGE_UI_INJECTION_KEY } from "@/Provider/injectionKey";

export function useBridgeUI(): BridgeUIContextApi {
  const api = inject(BRIDGE_UI_INJECTION_KEY, null);

  if (isNil(api)) {
    throw new Error(
      "useBridgeUI must be used after app.use(createBridgeUI(...)) or inside BridgeUIProvider.",
    );
  }

  return api;
}

export function useBridgeUIOptional(): BridgeUIContextApi | null {
  return inject(BRIDGE_UI_INJECTION_KEY, null);
}
