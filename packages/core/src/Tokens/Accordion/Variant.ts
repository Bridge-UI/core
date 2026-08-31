/**
 * Per-variant structural classes for the accordion root and items.
 */
export interface AccordionVariantItem {
  /**
   * Classes for each accordion item shell.
   */
  "item": string;

  /**
   * Classes for the expandable panel region.
   */
  "panel": string;

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
 *
 * Structural axis: flush (`default`) → boxed (`outlined`) → cards (`separated`).
 * Quiet option: `plain` (spacing + hover, no borders).
 */
export interface AccordionVariant {
  /**
   * Flush stacked sections with shared dividers. Default.
   */
  "default": AccordionVariantItem;

  /**
   * Boxed group: single outer border + internal dividers, no gap.
   */
  "outlined": AccordionVariantItem;

  /**
   * Quiet layout: List-like padding and hover, no borders or expanded accent.
   */
  "plain": AccordionVariantItem;

  /**
   * Separated cards with gap and individual borders.
   */
  "separated": AccordionVariantItem;
}

/**
 * Default accordion variant class maps.
 */
export const variantProps: AccordionVariant = {
  "plain": {
    "item": "",
    "root": "flex flex-col gap-1 px-2 py-2",
    "panel":
      "ml-3.5 translate-x-px border-l border-dark-200 p-0 py-0.5 pl-2.5 dark:border-dark-700",
    "trigger":
      "rounded-lg min-h-8 px-2 py-1.5 text-dark-700 hover:bg-black/5 dark:text-dark-200 dark:hover:bg-white/10",
  },
  "default": {
    "item": "",
    "panel": "",
    "trigger":
      "text-dark-700 hover:bg-dark-500/5 dark:text-dark-200 dark:hover:bg-dark-500/10",
    "root":
      "divide-y divide-dark-200 border-y border-dark-200 dark:divide-dark-700 dark:border-dark-700",
  },
  "separated": {
    "root": "flex flex-col gap-2",
    "item":
      "overflow-hidden rounded-lg border border-dark-200 dark:border-dark-700",
    "panel": "",
    "trigger":
      "text-dark-700 hover:bg-dark-500/5 dark:text-dark-200 dark:hover:bg-dark-500/10",
  },
  "outlined": {
    "item": "",
    "panel": "",
    "trigger":
      "text-dark-700 hover:bg-dark-500/5 dark:text-dark-200 dark:hover:bg-dark-500/10",
    "root":
      "overflow-hidden rounded-lg border border-dark-200 divide-y divide-dark-200 dark:border-dark-700 dark:divide-dark-700",
  },
};
