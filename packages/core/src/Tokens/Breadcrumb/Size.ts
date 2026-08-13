/**
 * Per-token sizing for breadcrumb root, list, items, links, separators, and icons.
 */
export interface BreadcrumbSizeItem {
  /**
   * Classes for the current-page crumb (non-link).
   */
  "current": string;

  /**
   * Icon size token for crumb and separator icons (`Icon` `size` prop).
   */
  "icon": string;

  /**
   * Classes for each list item shell.
   */
  "item": string;

  /**
   * Classes for interactive crumb links / buttons.
   */
  "link": string;

  /**
   * Classes for the ordered list.
   */
  "list": string;

  /**
   * Classes for the nav root.
   */
  "root": string;

  /**
   * Classes for the separator icon / slot between crumbs.
   */
  "separator": string;
}

/**
 * Breadcrumb size scale.
 */
export interface BreadcrumbSize {
  /**
   * Large size token.
   */
  "lg": BreadcrumbSizeItem;

  /**
   * Medium size token (default).
   */
  "md": BreadcrumbSizeItem;

  /**
   * Small size token.
   */
  "sm": BreadcrumbSizeItem;
}

/**
 * Default breadcrumb size classes.
 */
export const sizeProps: BreadcrumbSize = {
  "sm": {
    "icon": "xs",
    "root": "flex",
    "list": "flex items-center gap-2",
    "item": "flex items-center gap-2",
    "separator":
      "inline-flex shrink-0 items-center justify-center text-dark-400 dark:text-dark-500",
    "current":
      "inline-flex items-center gap-1 text-xs font-medium text-dark-700 dark:text-dark-200",
    "link":
      "inline-flex items-center gap-1 text-xs font-medium text-dark-500 transition-colors hover:text-dark-700 dark:text-dark-400 dark:hover:text-dark-200",
  },
  "lg": {
    "icon": "md",
    "root": "flex",
    "list": "flex items-center gap-3",
    "item": "flex items-center gap-3",
    "separator":
      "inline-flex shrink-0 items-center justify-center text-dark-400 dark:text-dark-500",
    "current":
      "inline-flex items-center gap-2 text-base font-medium text-dark-700 dark:text-dark-200",
    "link":
      "inline-flex items-center gap-2 text-base font-medium text-dark-500 transition-colors hover:text-dark-700 dark:text-dark-400 dark:hover:text-dark-200",
  },
  "md": {
    "icon": "sm",
    "root": "flex",
    "list": "flex items-center gap-2.5",
    "item": "flex items-center gap-2.5",
    "separator":
      "inline-flex shrink-0 items-center justify-center text-dark-400 dark:text-dark-500",
    "current":
      "inline-flex items-center gap-1.5 text-sm font-medium text-dark-700 dark:text-dark-200",
    "link":
      "inline-flex items-center gap-1.5 text-sm font-medium text-dark-500 transition-colors hover:text-dark-700 dark:text-dark-400 dark:hover:text-dark-200",
  },
};
