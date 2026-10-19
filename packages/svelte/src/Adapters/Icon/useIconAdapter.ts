// ** Core Imports
import type { IconAdapter } from "@bridge-ui/core/Adapters";

// ** Local Imports
import { useBridgeUI } from "@/Provider/context";

let iconAdapterForTests: undefined | IconAdapter;

/**
 * Sets a process-wide icon adapter fallback. For tests only.
 */
export function setIconAdapterForTests(adapter: undefined | IconAdapter) {
  iconAdapterForTests = adapter;
}

/**
 * Getter for the active icon adapter from `BridgeUIProvider`. Call during
 * component initialisation; read the getter inside `$derived`.
 */
export function useIconAdapter(): () => undefined | IconAdapter {
  const bridge = useBridgeUI();

  return () => {
    return bridge?.global.icons ?? iconAdapterForTests;
  };
}
