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
   * Classes for page number buttons.
   */
  "item": string;

  /**
   * Classes for prev/next icon buttons (same footprint as `item`).
   */
  "itemIcon": string;

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
    "list": "flex list-none items-center p-0 m-0",
    "ellipsis":
      "relative inline-flex h-9 min-w-9 items-center justify-center px-3 text-sm font-semibold text-dark-500 dark:text-dark-400",
    "itemIcon":
      "relative inline-flex items-center justify-center font-semibold transition-colors cursor-pointer focus:outline-none focus-visible:z-20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 h-9 w-9 p-0 text-sm",
    "item":
      "relative inline-flex items-center justify-center font-semibold transition-colors cursor-pointer focus:outline-none focus-visible:z-20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 h-9 min-w-9 px-3 text-sm",
  },
  "sm": {
    "icon": "xs",
    "root": "flex",
    "list": "flex list-none items-center p-0 m-0",
    "ellipsis":
      "relative inline-flex h-8 min-w-8 items-center justify-center px-2.5 text-xs font-semibold text-dark-500 dark:text-dark-400",
    "itemIcon":
      "relative inline-flex items-center justify-center font-semibold transition-colors cursor-pointer focus:outline-none focus-visible:z-20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 h-8 w-8 p-0 text-xs",
    "item":
      "relative inline-flex items-center justify-center font-semibold transition-colors cursor-pointer focus:outline-none focus-visible:z-20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 h-8 min-w-8 px-2.5 text-xs",
  },
  "lg": {
    "icon": "md",
    "root": "flex",
    "list": "flex list-none items-center p-0 m-0",
    "ellipsis":
      "relative inline-flex h-10 min-w-10 items-center justify-center px-4 text-base font-semibold text-dark-500 dark:text-dark-400",
    "itemIcon":
      "relative inline-flex items-center justify-center font-semibold transition-colors cursor-pointer focus:outline-none focus-visible:z-20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 h-10 w-10 p-0 text-base",
    "item":
      "relative inline-flex items-center justify-center font-semibold transition-colors cursor-pointer focus:outline-none focus-visible:z-20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 h-10 min-w-10 px-4 text-base",
  },
};
