/**
 * Per-color selected-state classes for tabs.
 * Inactive tabs use `dark-*` from the variant; these apply when selected.
 */
export interface TabsColorItem {
  /**
   * Text accent for the selected tab (also drives the underline via `currentColor`).
   */
  "tabSelected": string;

  /**
   * Soft background fill for `pill` / `solid` selected tabs.
   */
  "tabSelectedSoft": string;
}

/**
 * Tabs color tokens (selected accent). Only `primary` and `dark`.
 */
export interface TabsColor {
  /**
   * Dark / neutral accent for the selected tab.
   */
  "dark": TabsColorItem;

  /**
   * Primary accent for the selected tab (default).
   */
  "primary": TabsColorItem;
}

/**
 * Default tabs color maps (selected only).
 * No `border-*` here — that would recolor `divide-x` in `enclosed`.
 */
export const colorProps: TabsColor = {
  "dark": {
    "tabSelectedSoft": "bg-dark-500/10 dark:bg-dark-500/20",
    "tabSelected":
      "text-dark-800 hover:text-dark-800 dark:text-dark-100 dark:hover:text-dark-100",
  },
  "primary": {
    "tabSelectedSoft": "bg-primary-500/15 dark:bg-primary-500/20",
    "tabSelected":
      "text-primary-600 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-400",
  },
};
