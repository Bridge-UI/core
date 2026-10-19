// ** External Imports
import { getContext, hasContext, setContext } from "svelte";

// ** Local Imports
import type { BridgeUIContextApi } from "@/Provider/bridgeUITypes";

const BRIDGE_UI_CONTEXT_KEY = Symbol.for("@bridge-ui/svelte");

/**
 * Registers `api` for descendants. Call during component initialisation.
 */
export function setBridgeUIContext(api: BridgeUIContextApi) {
  setContext(BRIDGE_UI_CONTEXT_KEY, api);
}

/**
 * Nearest `BridgeUIProvider` context, or `null` outside a provider.
 * Call during component initialisation.
 */
export function useBridgeUI(): null | BridgeUIContextApi {
  if (!hasContext(BRIDGE_UI_CONTEXT_KEY)) {
    return null;
  }

  return getContext<BridgeUIContextApi>(BRIDGE_UI_CONTEXT_KEY);
}
