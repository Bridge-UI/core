// ** Core Imports
import type { IconAdapter } from "@bridge-ui/core";

// ** Local Imports
import { useBridgeUI } from "@/Provider/useBridgeUI";

let iconAdapterForTests: undefined | IconAdapter;

/**
 * Sets a process-wide icon adapter fallback. For tests only.
 */
export function setIconAdapterForTests(adapter: undefined | IconAdapter) {
  iconAdapterForTests = adapter;
}

/**
 * Returns the active icon adapter from {@link BridgeUIProvider}.
 * Semantic icon names require `global.icons` (see `packages/react/docs/examples`).
 */
export function useIconAdapter(): undefined | IconAdapter {
  const bridge = useBridgeUI();

  return bridge?.global.icons ?? iconAdapterForTests;
}
