// ** External Imports
import { computed, type ComputedRef } from "vue";

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
 * Semantic icon names require `global.icons` (see `packages/vue/examples`).
 */
export function useIconAdapter(): ComputedRef<undefined | IconAdapter> {
  const bridge = useBridgeUI();

  return computed(() => {
    return bridge?.global.value.icons ?? iconAdapterForTests;
  });
}
