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
 * Falls back to {@link defaultNativeDateAdapter} when unset.
 *
 * Syncs Bridge `locale` / `timeZone` onto the adapter. Per-component
 * `timeZone` still overrides via the method argument.
 */
export function useDateAdapter(): DateAdapter {
  const bridge = useBridgeUI();
  const adapter =
    bridge?.global.dates ?? dateAdapterForTests ?? defaultNativeDateAdapter;

  adapter.setLocale?.(bridge?.global.locale);
  adapter.setTimeZone?.(bridge?.global.timeZone);

  return adapter;
}
