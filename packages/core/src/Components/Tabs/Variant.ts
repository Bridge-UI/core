/**
 * Per-variant structural classes for the tab list and tab triggers.
 */
export interface TabsVariantItem {
  /**
   * Classes for the tab list container.
   */
  "list": string;

  /**
   * Classes for each tab trigger (unselected base).
   */
  "tab": string;

  /**
   * Extra classes for the selected tab (combine with color `tabSelected`).
   */
  "tabSelected": string;
}

/**
 * Tabs visual variants.
 */
export interface TabsVariant {
  /**
   * Underline / bottom-border style.
   */
  "line": TabsVariantItem;

  /**
   * Pill / filled selected style.
   */
  "pill": TabsVariantItem;
}

/**
 * Default tabs variant class maps.
 */
export const variantProps: TabsVariant = {
  "pill": {
    "list": "",
    "tabSelected": "",
    "tab":
      "text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-secondary-100",
  },
  "line": {
    "tabSelected": "border-current",
    "list": "border-b border-secondary-200 dark:border-secondary-800",
    "tab":
      "border-b-2 border-transparent text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-secondary-100 -mb-px",
  },
};
