/**
 * Per-align classes for DataTable cells and header cells.
 */
export interface DataTableAlignItem {
  /**
   * Classes for body cells.
   */
  "cell": string;

  /**
   * Classes for header cells.
   */
  "head": string;
}

/**
 * DataTable cell text alignment.
 */
export interface DataTableAlign {
  /**
   * Center-aligned cells.
   */
  "center": DataTableAlignItem;

  /**
   * End-aligned cells.
   */
  "end": DataTableAlignItem;

  /**
   * Start-aligned cells. Default.
   */
  "start": DataTableAlignItem;
}

/**
 * Default DataTable align class maps.
 */
export const alignProps: DataTableAlign = {
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
