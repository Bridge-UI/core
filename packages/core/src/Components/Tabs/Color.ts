/**
 * Per-color selected-state classes for tabs.
 */
export interface TabsColorItem {
  /**
   * Classes applied to the selected tab (and line indicator when `variant="line"`).
   */
  "tabSelected": string;
}

/**
 * Tabs color tokens.
 */
export interface TabsColor {
  /**
   * Danger accent for the selected tab.
   */
  "danger": TabsColorItem;

  /**
   * Default / neutral accent.
   */
  "default": TabsColorItem;

  /**
   * Info accent for the selected tab.
   */
  "info": TabsColorItem;

  /**
   * Primary accent for the selected tab.
   */
  "primary": TabsColorItem;

  /**
   * Secondary accent for the selected tab.
   */
  "secondary": TabsColorItem;

  /**
   * Success accent for the selected tab.
   */
  "success": TabsColorItem;

  /**
   * Warning accent for the selected tab.
   */
  "warning": TabsColorItem;
}

/**
 * Default tabs color maps.
 */
export const colorProps: TabsColor = {
  "info": {
    "tabSelected":
      "text-info-700 dark:text-info-300 border-info-600 dark:border-info-400 bg-info-500/15",
  },
  "danger": {
    "tabSelected":
      "text-danger-700 dark:text-danger-300 border-danger-600 dark:border-danger-400 bg-danger-500/15",
  },
  "primary": {
    "tabSelected":
      "text-primary-700 dark:text-primary-300 border-primary-600 dark:border-primary-400 bg-primary-500/15",
  },
  "success": {
    "tabSelected":
      "text-success-700 dark:text-success-300 border-success-600 dark:border-success-400 bg-success-500/15",
  },
  "warning": {
    "tabSelected":
      "text-warning-800 dark:text-warning-300 border-warning-600 dark:border-warning-400 bg-warning-500/15",
  },
  "default": {
    "tabSelected":
      "text-secondary-900 dark:text-secondary-50 border-secondary-900 dark:border-secondary-50 bg-secondary-500/15",
  },
  "secondary": {
    "tabSelected":
      "text-secondary-800 dark:text-secondary-100 border-secondary-700 dark:border-secondary-300 bg-secondary-500/20",
  },
};
