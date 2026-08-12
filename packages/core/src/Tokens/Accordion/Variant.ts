/**
 * Per-variant structural classes for the accordion root and items.
 */
export interface AccordionVariantItem {
  /**
   * Classes for each accordion item shell.
   */
  "item": string;

  /**
   * Classes for the accordion root.
   */
  "root": string;

  /**
   * Classes for each trigger button (layout / hover base).
   */
  "trigger": string;
}

/**
 * Accordion visual variants.
 */
export interface AccordionVariant {
  /**
   * Flush stacked sections with shared dividers. Default.
   */
  "default": AccordionVariantItem;

  /**
   * Separated cards with gap and individual borders.
   */
  "separated": AccordionVariantItem;
}

/**
 * Default accordion variant class maps.
 */
export const variantProps: AccordionVariant = {
  "default": {
    "item": "",
    "trigger":
      "text-dark-700 hover:bg-dark-500/5 dark:text-dark-200 dark:hover:bg-dark-500/10",
    "root":
      "divide-y divide-dark-200 border-y border-dark-200 dark:divide-dark-700 dark:border-dark-700",
  },
  "separated": {
    "root": "flex flex-col gap-2",
    "item":
      "overflow-hidden rounded-lg border border-dark-200 dark:border-dark-700",
    "trigger":
      "text-dark-700 hover:bg-dark-500/5 dark:text-dark-200 dark:hover:bg-dark-500/10",
  },
};
