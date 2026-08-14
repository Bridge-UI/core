/**
 * Per-token sizing for pagination root, list, items, and icons.
 */
export interface PaginationSizeItem {
  /**
   * Classes for ellipsis placeholders.
   */
  "ellipsis": string;

  /**
   * Icon size token for prev/next `Icon` (`size` prop).
   */
  "icon": string;

  /**
   * Classes for page number / control buttons.
   */
  "item": string;

  /**
   * Classes for the ordered list of controls.
   */
  "list": string;

  /**
   * Classes for the nav root.
   */
  "root": string;
}

/**
 * Pagination size scale.
 */
export interface PaginationSize {
  /**
   * Large size token.
   */
  "lg": PaginationSizeItem;

  /**
   * Medium size token (default).
   */
  "md": PaginationSizeItem;

  /**
   * Small size token.
   */
  "sm": PaginationSizeItem;
}

/**
 * Default pagination size classes.
 */
export const sizeProps: PaginationSize = {
  "md": {
    "icon": "sm",
    "root": "flex",
    "list": "flex items-center",
    "ellipsis":
      "relative inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-dark-500 dark:text-dark-400",
    "item":
      "relative inline-flex items-center justify-center px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:z-20 disabled:pointer-events-none disabled:opacity-50",
  },
  "sm": {
    "icon": "xs",
    "root": "flex",
    "list": "flex items-center",
    "ellipsis":
      "relative inline-flex items-center justify-center px-2.5 py-1.5 text-xs font-semibold text-dark-500 dark:text-dark-400",
    "item":
      "relative inline-flex items-center justify-center px-2.5 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus-visible:z-20 disabled:pointer-events-none disabled:opacity-50",
  },
  "lg": {
    "icon": "md",
    "root": "flex",
    "list": "flex items-center",
    "ellipsis":
      "relative inline-flex items-center justify-center px-4 py-2.5 text-base font-semibold text-dark-500 dark:text-dark-400",
    "item":
      "relative inline-flex items-center justify-center px-4 py-2.5 text-base font-semibold transition-colors focus:outline-none focus-visible:z-20 disabled:pointer-events-none disabled:opacity-50",
  },
};
