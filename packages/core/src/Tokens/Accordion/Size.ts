/**
 * Per-token sizing for accordion root, items, triggers, panels, and icons.
 */
export interface AccordionSizeItem {
  /**
   * Icon size token for the expand indicator (`Icon` `size` prop).
   */
  "icon": string;

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
   * Classes for each trigger button.
   */
  "trigger": string;
}

/**
 * Accordion size scale.
 */
export interface AccordionSize {
  /**
   * Large size token.
   */
  "lg": AccordionSizeItem;

  /**
   * Medium size token (default).
   */
  "md": AccordionSizeItem;

  /**
   * Small size token.
   */
  "sm": AccordionSizeItem;
}

/**
 * Default accordion size classes.
 */
export const sizeProps: AccordionSize = {
  "md": {
    "root": "",
    "item": "",
    "icon": "md",
    "trigger": "gap-2 px-4 py-3 text-sm font-medium",
    "panel": "px-4 pb-4 text-sm text-dark-600 dark:text-dark-300",
  },
  "sm": {
    "root": "",
    "item": "",
    "icon": "sm",
    "trigger": "gap-1.5 px-3 py-2 text-xs font-medium",
    "panel": "px-3 pb-3 text-xs text-dark-600 dark:text-dark-300",
  },
  "lg": {
    "root": "",
    "item": "",
    "icon": "lg",
    "trigger": "gap-2.5 px-5 py-4 text-base font-medium",
    "panel": "px-5 pb-5 text-base text-dark-600 dark:text-dark-300",
  },
};
