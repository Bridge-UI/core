/**
 * Per-token sizing for table wrapper, cells, and caption.
 */
export interface TableSizeItem {
  /**
   * Classes for the caption.
   */
  "caption": string;

  /**
   * Classes for body cells (`td`).
   */
  "cell": string;

  /**
   * Classes for header cells (`th`).
   */
  "head": string;

  /**
   * Classes for the overflow wrapper.
   */
  "root": string;

  /**
   * Classes for the `<table>` element.
   */
  "table": string;
}

/**
 * Table size scale (cell padding / type).
 */
export interface TableSize {
  /**
   * Large size token.
   */
  "lg": TableSizeItem;

  /**
   * Medium size token (default).
   */
  "md": TableSizeItem;

  /**
   * Small size token.
   */
  "sm": TableSizeItem;
}

/**
 * Default table size classes.
 */
export const sizeProps: TableSize = {
  "md": {
    "root": "",
    "table": "text-sm",
    "head": "px-3 py-2.5 text-sm font-semibold",
    "caption": "py-2 text-sm text-dark-500 dark:text-dark-400",
    "cell": "px-3 py-2.5 text-sm text-dark-700 dark:text-dark-200",
  },
  "sm": {
    "root": "",
    "table": "text-xs",
    "head": "px-2 py-1.5 text-xs font-semibold",
    "caption": "py-1.5 text-xs text-dark-500 dark:text-dark-400",
    "cell": "px-2 py-1.5 text-xs text-dark-700 dark:text-dark-200",
  },
  "lg": {
    "root": "",
    "table": "text-base",
    "head": "px-4 py-3 text-base font-semibold",
    "caption": "py-2.5 text-base text-dark-500 dark:text-dark-400",
    "cell": "px-4 py-3 text-base text-dark-700 dark:text-dark-200",
  },
};
