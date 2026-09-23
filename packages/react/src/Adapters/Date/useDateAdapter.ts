// ** Core Imports
import {
  defaultNativeDateAdapter,
  type DateAdapter,
} from "@bridge-ui/core/Adapters";

// ** Local Imports
import { useBridgeUI } from "@/Provider/useBridgeUI";

let dateAdapterForTests: undefined | DateAdapter;

/**
 * Sets a process-wide date adapter fallback. For tests only.
 */
export function setDateAdapterForTests(adapter: undefined | DateAdapter) {
  dateAdapterForTests = adapter;
}

/**
 * Returns the active date adapter from {@link BridgeUIProvider}.
 * Uses `global.dates` when set, otherwise the provider-owned native adapter.
 * Outside a provider, falls back to {@link defaultNativeDateAdapter}.
 *
 * Syncs Bridge `locale` / `timeZone` onto that adapter. Per-component
 * `timeZone` still overrides via the method argument.
 */
export function useDateAdapter(): DateAdapter {
  const bridge = useBridgeUI();
  const adapter =
    bridge?.global.dates ??
    dateAdapterForTests ??
    bridge?.nativeDates ??
    defaultNativeDateAdapter;

  if (bridge) {
    adapter.setLocale?.(bridge.global.locale);
    adapter.setTimeZone?.(bridge.global.timeZone);
  }

  return adapter;
}
