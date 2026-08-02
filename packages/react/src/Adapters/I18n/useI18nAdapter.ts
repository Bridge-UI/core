// ** Core Imports
import type { I18nAdapter } from "@bridge-ui/core";

// ** Local Imports
import { useBridgeUI } from "@/Provider/useBridgeUI";

let i18nAdapterForTests: undefined | I18nAdapter;

/**
 * Sets a process-wide i18n adapter fallback. For tests only.
 */
export function setI18nAdapterForTests(adapter: undefined | I18nAdapter) {
  i18nAdapterForTests = adapter;
}

/**
 * Returns the active i18n adapter from {@link BridgeUIProvider}.
 * When unset, `resolveMessage` returns the English source string
 * (see `examples/adapters/react`).
 */
export function useI18nAdapter(): undefined | I18nAdapter {
  const bridge = useBridgeUI();

  return bridge?.global.i18n ?? i18nAdapterForTests;
}
