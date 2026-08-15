// ** Core Imports
import {
  defaultNativeDateAdapter,
  type DateAdapter,
  type DateAdapterContext,
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
 */
export function useDateAdapter(): DateAdapter {
  const bridge = useBridgeUI();

  return (
    bridge?.global.dates ?? dateAdapterForTests ?? defaultNativeDateAdapter
  );
}

/**
 * Returns a builder for {@link DateAdapterContext} from Bridge global config.
 * Locale always comes from the provider — calendar / date components never
 * accept a `locale` prop. Only `timeZone` may be overridden per instance.
 */
export function useDateAdapterContext(): (
  timeZone?: string,
) => DateAdapterContext {
  const bridge = useBridgeUI();

  return (timeZone) => {
    return {
      locale: bridge?.global.locale,
      timeZone: timeZone ?? bridge?.global.timeZone,
    };
  };
}
