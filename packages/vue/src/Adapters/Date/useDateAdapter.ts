// ** External Imports
import { computed, type ComputedRef } from "vue";

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
export function useDateAdapter(): ComputedRef<DateAdapter> {
  const bridge = useBridgeUI();

  return computed(() => {
    const adapter =
      bridge?.global.value.dates ??
      dateAdapterForTests ??
      defaultNativeDateAdapter;

    if (bridge) {
      adapter.setLocale?.(bridge.global.value.locale);
      adapter.setTimeZone?.(bridge.global.value.timeZone);
    }

    return adapter;
  });
}
