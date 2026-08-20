/**
 * Per-variant structural classes for DataTable chrome.
 *
 * Pairs with Pagination: `plain` → `text`, `ghost` → `ghost`,
 * `bordered` → `outlined`.
 */
export interface DataTableVariantItem {
  /**
   * Classes for the body rowgroup.
   */
  "body": string;

  /**
   * Classes for body cells.
   */
  "cell": string;

  /**
   * Classes for header cells.
   */
  "head": string;

  /**
   * Classes for the header rowgroup.
   */
  "header": string;

  /**
   * Extra classes when `stickyHeader` is set (combine with `head`).
   */
  "headSticky": string;

  /**
   * Classes for the chrome wrapper.
   */
  "root": string;

  /**
   * Classes for rows.
   */
  "row": string;

  /**
   * Extra classes for hoverable body rows.
   */
  "rowHover": string;

  /**
   * Extra classes for striped body rows.
   */
  "rowStriped": string;

  /**
   * Classes for the grid (`role="table"`).
   */
  "table": string;
}

/**
 * DataTable visual variants.
 *
 * - `plain` — flush rules, no outer ring. Default companion to Pagination `text`.
 * - `ghost` — soft rounded surface. Companion to Pagination `ghost`.
 * - `bordered` — inset ring and cell borders. Companion to Pagination `outlined`.
 */
export interface DataTableVariant {
  /**
   * Inset ring and cell borders. Companion to Pagination `outlined`.
   */
  "bordered": DataTableVariantItem;

  /**
   * Soft rounded surface, quiet header. Companion to Pagination `ghost`.
   */
  "ghost": DataTableVariantItem;

  /**
   * Flush header underline, no outer ring. Default. Companion to Pagination `text`.
   */
  "plain": DataTableVariantItem;
}

/**
 * Default DataTable variant class maps.
 */
export const variantProps: DataTableVariant = {
  "ghost": {
    "row": "",
    "body": "",
    "table": "",
    "root": "relative rounded-lg",
    "cell": "text-dark-700 dark:text-dark-200",
    "header": "bg-dark-500/5 dark:bg-dark-500/10",
    "rowStriped": "even:bg-dark-50 dark:even:bg-dark-800/40",
    "rowHover": "hover:bg-dark-500/10 dark:hover:bg-dark-500/15",
    "head":
      "bg-dark-500/5 text-dark-900 dark:bg-dark-500/10 dark:text-dark-200",
    "headSticky":
      "sticky top-0 z-10 bg-dark-50/75 backdrop-blur dark:bg-dark-800/75",
  },
  "plain": {
    "row": "",
    "body": "",
    "table": "",
    "root": "relative",
    "rowStriped": "even:bg-dark-50 dark:even:bg-dark-800/40",
    "header": "border-b border-dark-300 dark:border-dark-700",
    "rowHover": "hover:bg-dark-500/5 dark:hover:bg-dark-500/10",
    "headSticky":
      "sticky top-0 z-10 bg-white/75 backdrop-blur dark:bg-dark-900/75",
    "cell":
      "border-b border-dark-200 text-dark-500 dark:border-dark-700 dark:text-dark-400",
    "head":
      "border-b border-dark-300 text-dark-900 dark:border-dark-700 dark:text-dark-100",
  },
  "bordered": {
    "row": "",
    "body": "",
    "table": "",
    "header": "bg-dark-50 dark:bg-dark-800/60",
    "rowStriped": "even:bg-dark-50 dark:even:bg-dark-800/40",
    "rowHover": "hover:bg-dark-500/5 dark:hover:bg-dark-500/10",
    "headSticky":
      "sticky top-0 z-10 bg-white/75 backdrop-blur dark:bg-dark-800/75",
    "root":
      "relative rounded-lg ring-1 ring-inset ring-dark-300 dark:ring-dark-700",
    "cell":
      "border border-dark-200 text-dark-500 dark:border-dark-700 dark:text-dark-400",
    "head":
      "border border-dark-200 bg-dark-50 text-dark-900 dark:border-dark-700 dark:bg-dark-800/60 dark:text-dark-100",
  },
};
