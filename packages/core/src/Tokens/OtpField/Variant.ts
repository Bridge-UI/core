export interface OtpFieldVariantItem {
  /**
   * Structural classes for each pin cell wrapper.
   */
  "pin": string;

  /**
   * Pin background when disabled (skipped while invalid).
   */
  "pinDisabled"?: string;
}

export interface OtpFieldVariant {
  /**
   * Filled visual variant.
   */
  "filled": OtpFieldVariantItem;

  /**
   * Notched outline visual variant.
   */
  "notched": OtpFieldVariantItem;

  /**
   * Outline visual variant.
   */
  "outline": OtpFieldVariantItem;

  /**
   * Stacked label visual variant.
   */
  "stacked": OtpFieldVariantItem;

  /**
   * Underlined visual variant.
   */
  "underlined": OtpFieldVariantItem;
}

/**
 * Pin-level variants mirror FormField chrome. `stacked` matches filled; `notched`
 * matches outline (notch label does not apply per pin).
 */
export const variantProps: OtpFieldVariant = {
  "underlined": {
    "pin":
      "rounded-none bg-transparent shadow-none ring-0 border-0 border-b-2 border-dark-300 dark:border-dark-600 focus-within:ring-0",
  },
  "outline": {
    "pinDisabled": "bg-dark-100 dark:bg-dark-700/50",
    "pin":
      "bg-white dark:bg-dark-800 ring-1 ring-inset ring-dark-300 dark:ring-dark-500 focus-within:ring-2",
  },
  "notched": {
    "pinDisabled": "bg-dark-100 dark:bg-dark-700/50",
    "pin":
      "bg-white dark:bg-dark-800 ring-1 ring-inset ring-dark-300 dark:ring-dark-500 focus-within:ring-2",
  },
  "stacked": {
    "pinDisabled": "bg-dark-50 dark:bg-dark-700/40",
    "pin":
      "bg-dark-100 dark:bg-dark-700 ring-1 ring-inset ring-dark-200 dark:ring-dark-600 focus-within:ring-2",
  },
  "filled": {
    "pinDisabled": "bg-dark-50 dark:bg-dark-700/40",
    "pin":
      "bg-dark-100 dark:bg-dark-700 border-transparent ring-1 ring-inset ring-transparent focus-within:ring-2",
  },
};
