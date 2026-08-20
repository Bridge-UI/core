/**
 * Per-token sizing for DataTable wrapper, grid, and cells.
 */
export interface DataTableSizeItem {
  /**
   * Classes for body cells.
   */
  "cell": string;

  /**
   * Classes for header cells.
   */
  "head": string;

  /**
   * Classes for the chrome wrapper.
   */
  "root": string;

  /**
   * Classes for the grid (`role="table"`).
   */
  "table": string;
}

/**
 * DataTable size scale (cell padding / type).
 */
export interface DataTableSize {
  /**
   * Large size token.
   */
  "lg": DataTableSizeItem;

  /**
   * Medium size token (default).
   */
  "md": DataTableSizeItem;

  /**
   * Small size token.
   */
  "sm": DataTableSizeItem;
}

/**
 * Default DataTable size classes.
 */
export const sizeProps: DataTableSize = {
  "md": {
    "root": "",
    "table": "text-sm",
    "head": "px-3 py-3.5 text-sm font-semibold",
    "cell":
      "whitespace-nowrap px-3 py-4 text-sm text-dark-500 dark:text-dark-400",
  },
  "sm": {
    "root": "",
    "table": "text-xs",
    "head": "px-2 py-2 text-xs font-semibold",
    "cell":
      "whitespace-nowrap px-2 py-2.5 text-xs text-dark-500 dark:text-dark-400",
  },
  "lg": {
    "root": "",
    "table": "text-base",
    "head": "px-4 py-4 text-base font-semibold",
    "cell":
      "whitespace-nowrap px-4 py-4 text-base text-dark-500 dark:text-dark-400",
  },
};
