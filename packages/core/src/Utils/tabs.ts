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
  if (values.length === 0) {
    return current;
  }

  const startIndex = values.indexOf(current);
  const from = startIndex === -1 ? 0 : startIndex;

  for (let step = 1; step <= values.length; step += 1) {
    const index =
      (from + direction * step + values.length * step) % values.length;
    const candidate = values[index];

    if (candidate !== undefined && !disabledValues.has(candidate)) {
      return candidate;
    }
  }

  return current;
}
