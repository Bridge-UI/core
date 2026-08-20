/**
 * Per-variant structural classes for table chrome.
 *
 * Pairs with Pagination: `plain` → `text`, `ghost` → `ghost`,
 * `bordered` → `outlined`.
 */
export interface TableVariantItem {
  /**
   * Classes for `tbody`.
   */
  "body": string;

  /**
   * Classes for the caption.
   */
  "caption": string;

  /**
   * Classes for body cells (`td`).
   */
  "cell": string;

  /**
   * Extra classes when a column is horizontally sticky.
   */
  "cellSticky": string;

  /**
   * Classes for `tfoot`.
   */
  "footer": string;

  /**
   * Classes for header cells (`th`).
   */
  "head": string;

  /**
   * Classes for `thead`.
   */
  "header": string;

  /**
   * Extra classes when `stickyHeader` is set (combine with `head`).
   */
  "headSticky": string;

  /**
   * Classes for the wrapper around `<table>`.
   */
  "root": string;

  /**
   * Classes for rows (`tr`).
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
   * Classes for the `<table>` element.
   */
  "table": string;

  /**
   * Table layout when `stickyHeader` is set (`border-separate`).
   */
  "tableSticky": string;
}

/**
 * Table visual variants.
 *
 * - `plain` — flush rules, no outer ring. Default companion to Pagination `text`.
 * - `ghost` — soft rounded surface. Companion to Pagination `ghost`.
 * - `bordered` — inset ring and cell borders. Companion to Pagination `outlined`.
 */
export interface TableVariant {
  /**
   * Inset ring and cell borders. Companion to Pagination `outlined`.
   */
  "bordered": TableVariantItem;

  /**
   * Soft rounded surface, quiet header. Companion to Pagination `ghost`.
   */
  "ghost": TableVariantItem;

  /**
   * Flush header underline, no outer ring. Default. Companion to Pagination `text`.
   */
  "plain": TableVariantItem;
}

/**
 * Default table variant class maps.
 */
export const variantProps: TableVariant = {
  "ghost": {
    "row": "",
    "body": "",
    "footer": "",
    "table": "border-collapse",
    "caption": "caption-bottom",
    "root": "relative rounded-lg",
    "cell": "text-dark-700 dark:text-dark-200",
    "header": "bg-dark-500/5 dark:bg-dark-500/10",
    "tableSticky": "border-separate border-spacing-0",
    "cellSticky": "sticky z-10 bg-white dark:bg-dark-900",
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
    "footer": "",
    "root": "relative",
    "table": "border-collapse",
    "caption": "caption-bottom",
    "tableSticky": "border-separate border-spacing-0",
    "cellSticky": "sticky z-10 bg-white dark:bg-dark-900",
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
    "footer": "",
    "table": "border-collapse",
    "caption": "caption-bottom",
    "header": "bg-dark-50 dark:bg-dark-800/60",
    "tableSticky": "border-separate border-spacing-0",
    "cellSticky": "sticky z-10 bg-white dark:bg-dark-800",
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
