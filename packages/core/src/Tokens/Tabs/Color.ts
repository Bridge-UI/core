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
 * Tabs color tokens (selected accent).
 */
export interface TabsColor {
  /**
   * `dark` semantic color palette.
   */
  "dark": TabsColorItem;

  /**
   * `error` semantic color palette.
   */
  "error": TabsColorItem;

  /**
   * Info semantic color palette.
   */
  "info": TabsColorItem;

  /**
   * `primary` semantic color palette.
   */
  "primary": TabsColorItem;

  /**
   * `secondary` semantic color palette.
   */
  "secondary": TabsColorItem;

  /**
   * `success` semantic color palette.
   */
  "success": TabsColorItem;

  /**
   * `warning` semantic color palette.
   */
  "warning": TabsColorItem;
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
  "info": {
    "tabSelectedSoft": "bg-info-500/15 dark:bg-info-500/20",
    "tabSelected":
      "text-info-600 hover:text-info-600 dark:text-info-400 dark:hover:text-info-400",
  },
  "error": {
    "tabSelectedSoft": "bg-error-500/15 dark:bg-error-500/20",
    "tabSelected":
      "text-error-600 hover:text-error-600 dark:text-error-400 dark:hover:text-error-400",
  },
  "primary": {
    "tabSelectedSoft": "bg-primary-500/15 dark:bg-primary-500/20",
    "tabSelected":
      "text-primary-600 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-400",
  },
  "success": {
    "tabSelectedSoft": "bg-success-500/15 dark:bg-success-500/20",
    "tabSelected":
      "text-success-600 hover:text-success-600 dark:text-success-400 dark:hover:text-success-400",
  },
  "warning": {
    "tabSelectedSoft": "bg-warning-500/15 dark:bg-warning-500/20",
    "tabSelected":
      "text-warning-600 hover:text-warning-600 dark:text-warning-400 dark:hover:text-warning-400",
  },
  "secondary": {
    "tabSelectedSoft": "bg-secondary-500/15 dark:bg-secondary-500/20",
    "tabSelected":
      "text-secondary-600 hover:text-secondary-600 dark:text-secondary-400 dark:hover:text-secondary-400",
  },
};
