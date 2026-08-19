/**
 * Per-align classes for table cells and header cells.
 */
export interface TableAlignItem {
  /**
   * Classes for body cells (`td`).
   */
  "cell": string;

  /**
   * Classes for header cells (`th`).
   */
  "head": string;
}

/**
 * Table cell text alignment.
 */
export interface TableAlign {
  /**
   * Center-aligned cells.
   */
  "center": TableAlignItem;

  /**
   * End-aligned cells (also the `numeric` default).
   */
  "end": TableAlignItem;

  /**
   * Start-aligned cells. Default.
   */
  "start": TableAlignItem;
}

/**
 * Default table align class maps.
 */
export const alignProps: TableAlign = {
  "end": {
    "cell": "text-end",
    "head": "text-end",
  },
  "start": {
    "cell": "text-start",
    "head": "text-start",
  },
  "center": {
    "cell": "text-center",
    "head": "text-center",
  },
};
