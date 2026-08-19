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
   * Classes for the overflow wrapper.
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
    "cell": "text-dark-700 dark:text-dark-200",
    "root": "relative overflow-auto rounded-lg",
    "header": "bg-dark-500/5 dark:bg-dark-500/10",
    "rowHover": "hover:bg-dark-500/10 dark:hover:bg-dark-500/15",
    "headSticky": "sticky top-0 z-10 bg-dark-50 dark:bg-dark-800",
    "rowStriped": "odd:bg-dark-500/[0.06] dark:odd:bg-dark-500/10",
    "head":
      "bg-dark-500/5 text-dark-600 dark:bg-dark-500/10 dark:text-dark-300",
  },
  "plain": {
    "row": "",
    "body": "",
    "footer": "",
    "table": "border-collapse",
    "caption": "caption-bottom",
    "root": "relative overflow-auto",
    "header": "border-b border-dark-200 dark:border-dark-700",
    "headSticky": "sticky top-0 z-10 bg-white dark:bg-dark-900",
    "rowHover": "hover:bg-dark-500/5 dark:hover:bg-dark-500/10",
    "rowStriped": "odd:bg-dark-500/[0.04] dark:odd:bg-dark-500/10",
    "cell":
      "border-b border-dark-200 text-dark-700 dark:border-dark-700 dark:text-dark-200",
    "head":
      "text-dark-600 border-b-2 border-dark-200 dark:text-dark-300 dark:border-dark-700",
  },
  "bordered": {
    "row": "",
    "body": "",
    "footer": "",
    "table": "border-collapse",
    "caption": "caption-bottom",
    "header": "bg-dark-50 dark:bg-dark-800/60",
    "rowHover": "hover:bg-dark-500/5 dark:hover:bg-dark-500/10",
    "headSticky": "sticky top-0 z-10 bg-dark-50 dark:bg-dark-800",
    "rowStriped": "odd:bg-dark-500/[0.04] dark:odd:bg-dark-500/10",
    "cell":
      "border border-dark-200 text-dark-700 dark:border-dark-700 dark:text-dark-200",
    "root":
      "relative overflow-auto rounded-lg ring-1 ring-inset ring-dark-200 dark:ring-dark-700",
    "head":
      "border border-dark-200 bg-dark-50 text-dark-600 dark:border-dark-700 dark:bg-dark-800/60 dark:text-dark-300",
  },
};
