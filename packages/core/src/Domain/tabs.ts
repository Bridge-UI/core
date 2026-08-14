// ** External Imports
import { find, isUndefined, range } from "es-toolkit/compat";

/**
 * Activation mode for keyboard navigation in tabs.
 */
export type TabsActivation = "manual" | "automatic";

/**
 * Stable DOM id for a tab trigger.
 */
export function getTabId(tabsId: string, value: string): string {
  return `${tabsId}-tab-${value}`;
}

/**
 * Stable DOM id for a tab panel.
 */
export function getTabPanelId(tabsId: string, value: string): string {
  return `${tabsId}-panel-${value}`;
}

/**
 * Returns the next enabled tab value in `values` from `current`, wrapping around.
 * Skips values present in `disabledValues`. When none are enabled, returns `current`.
 */
export function getAdjacentTabValue(
  values: readonly string[],
  current: string,
  direction: 1 | -1,
  disabledValues: ReadonlySet<string> = new Set(),
): string {
  const { length } = values;

  if (length === 0) {
    return current;
  }

  const startIndex = values.indexOf(current);
  const from = startIndex === -1 ? 0 : startIndex;

  const candidate = find(
    range(1, length + 1).map((step) => {
      const index = (from + direction * step + length * step) % length;

      return values[index];
    }),
    (value) => {
      return !isUndefined(value) && !disabledValues.has(value);
    },
  );

  return candidate ?? current;
}
