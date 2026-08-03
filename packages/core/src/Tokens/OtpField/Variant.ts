export interface OtpFieldVariantItem {
  /**
   * Structural classes for each pin cell wrapper.
   */
  "pin": string;
}

export interface OtpFieldVariant {
  "filled": OtpFieldVariantItem;
  "notched": OtpFieldVariantItem;
  "outline": OtpFieldVariantItem;
  "stacked": OtpFieldVariantItem;
  "underlined": OtpFieldVariantItem;
}

/**
 * Pin-level variants mirror FormField chrome. `stacked` matches filled; `notched`
 * matches outline (notch label does not apply per pin).
 */
export const variantProps: OtpFieldVariant = {
  "outline": {
    "pin":
      "bg-white dark:bg-gray-900 ring-1 ring-inset ring-gray-300 dark:ring-gray-500 focus-within:ring-2",
  },
  "notched": {
    "pin":
      "bg-white dark:bg-gray-900 ring-1 ring-inset ring-gray-300 dark:ring-gray-500 focus-within:ring-2",
  },
  "stacked": {
    "pin":
      "bg-gray-100 dark:bg-gray-800 ring-1 ring-inset ring-gray-200 dark:ring-gray-600 focus-within:ring-2",
  },
  "filled": {
    "pin":
      "bg-gray-100 dark:bg-gray-800 border-transparent ring-1 ring-inset ring-transparent focus-within:ring-2",
  },
  "underlined": {
    "pin":
      "rounded-none bg-transparent shadow-none ring-0 border-0 border-b-2 border-gray-300 dark:border-gray-600 focus-within:ring-0",
  },
};
