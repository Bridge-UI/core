// ** Core Imports
import {
  defaultNativeDateAdapter,
  type DateAdapter,
} from "@bridge-ui/core/Adapters";

// ** Local Imports
import { useBridgeUI } from "@/Provider/context";

let dateAdapterForTests: undefined | DateAdapter;

/**
 * Sets a process-wide date adapter fallback. For tests only.
 */
export function setDateAdapterForTests(adapter: undefined | DateAdapter) {
  dateAdapterForTests = adapter;
}

/**
 * Getter for the active date adapter: `global.dates`, then the
 * provider-owned native adapter, then {@link defaultNativeDateAdapter}.
 * Syncs Bridge `locale` / `timeZone` onto the adapter on each read.
 */
export function useDateAdapter(): () => DateAdapter {
  const bridge = useBridgeUI();

  return () => {
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
  };
}
