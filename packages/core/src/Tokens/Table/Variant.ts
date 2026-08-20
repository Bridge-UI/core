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
   * Inset shadow on the first end-pinned column.
   */
  "cellStickyEdgeEnd": string;

  /**
   * Inset shadow on the last start-pinned column.
   */
  "cellStickyEdgeStart": string;

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
  "bordered": {
    "row": "",
    "body": "",
    "footer": "",
    "table": "border-collapse",
    "caption": "caption-bottom",
    "header": "bg-dark-100 dark:bg-dark-800",
    "tableSticky": "border-separate border-spacing-0",
    "rowHover": "hover:bg-dark-500/5 dark:hover:bg-dark-500/10",
    "rowStriped": "even:bg-dark-100/60 dark:even:bg-dark-800/50",
    "headSticky": "sticky top-0 z-20 bg-dark-100 dark:bg-dark-800",
    "root": "relative ring-1 ring-inset ring-dark-300 dark:ring-dark-700",
    "cellSticky": "relative isolate sticky z-10 bg-white dark:bg-dark-800",
    "cell":
      "relative border border-dark-200 text-dark-500 dark:border-dark-700 dark:text-dark-400",
    "head":
      "relative border border-dark-200 bg-dark-100 text-dark-900 dark:border-dark-700 dark:bg-dark-800 dark:text-dark-100",
    "cellStickyEdgeEnd":
      "before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-2.5 before:-translate-x-full before:shadow-[inset_-10px_0_8px_-8px_rgba(15,23,42,0.18)] dark:before:shadow-[inset_-10px_0_8px_-8px_rgba(0,0,0,0.5)]",
    "cellStickyEdgeStart":
      "after:pointer-events-none after:absolute after:inset-y-0 after:end-0 after:w-2.5 after:translate-x-full after:bg-transparent after:shadow-[inset_10px_0_8px_-8px_rgba(15,23,42,0.18)] dark:after:shadow-[inset_10px_0_8px_-8px_rgba(0,0,0,0.5)]",
  },
  "ghost": {
    "row": "",
    "body": "",
    "footer": "",
    "root": "relative",
    "table": "border-collapse",
    "caption": "caption-bottom",
    "header": "bg-dark-100 dark:bg-dark-800",
    "tableSticky": "border-separate border-spacing-0",
    "rowStriped": "even:bg-dark-100/60 dark:even:bg-dark-800/50",
    "rowHover": "hover:bg-dark-500/10 dark:hover:bg-dark-500/15",
    "headSticky": "sticky top-0 z-20 bg-dark-100 dark:bg-dark-800",
    "cellSticky": "relative isolate sticky z-10 bg-white dark:bg-dark-900",
    "cell":
      "relative text-dark-700 after:pointer-events-none after:absolute after:inset-y-2.5 after:end-0 after:w-px after:bg-dark-200 last:after:hidden dark:text-dark-200 dark:after:bg-dark-600",
    "head":
      "relative bg-dark-100 text-dark-900 after:pointer-events-none after:absolute after:inset-y-2.5 after:end-0 after:w-px after:bg-dark-200 last:after:hidden dark:bg-dark-800 dark:text-dark-200 dark:after:bg-dark-600",
    "cellStickyEdgeEnd":
      "before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-2.5 before:-translate-x-full before:shadow-[inset_-10px_0_8px_-8px_rgba(15,23,42,0.18)] dark:before:shadow-[inset_-10px_0_8px_-8px_rgba(0,0,0,0.5)]",
    "cellStickyEdgeStart":
      "after:pointer-events-none after:absolute after:inset-y-0 after:end-0 after:w-2.5 after:translate-x-full after:bg-transparent after:shadow-[inset_10px_0_8px_-8px_rgba(15,23,42,0.18)] dark:after:shadow-[inset_10px_0_8px_-8px_rgba(0,0,0,0.5)]",
  },
  "plain": {
    "row": "",
    "body": "",
    "footer": "",
    "root": "relative",
    "table": "border-collapse",
    "caption": "caption-bottom",
    "tableSticky": "border-separate border-spacing-0",
    "rowHover": "hover:bg-dark-500/5 dark:hover:bg-dark-500/10",
    "rowStriped": "even:bg-dark-100/60 dark:even:bg-dark-800/50",
    "headSticky": "sticky top-0 z-20 bg-dark-100 dark:bg-dark-800",
    "cellSticky": "relative isolate sticky z-10 bg-white dark:bg-dark-900",
    "header":
      "border-b border-dark-300 bg-dark-100 dark:border-dark-700 dark:bg-dark-800",
    "cell":
      "relative border-b border-dark-200 text-dark-500 after:pointer-events-none after:absolute after:inset-y-2.5 after:end-0 after:w-px after:bg-dark-200 last:after:hidden dark:border-dark-700 dark:text-dark-400 dark:after:bg-dark-600",
    "cellStickyEdgeEnd":
      "before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-2.5 before:-translate-x-full before:shadow-[inset_-10px_0_8px_-8px_rgba(15,23,42,0.18)] dark:before:shadow-[inset_-10px_0_8px_-8px_rgba(0,0,0,0.5)]",
    "cellStickyEdgeStart":
      "after:pointer-events-none after:absolute after:inset-y-0 after:end-0 after:w-2.5 after:translate-x-full after:bg-transparent after:shadow-[inset_10px_0_8px_-8px_rgba(15,23,42,0.18)] dark:after:shadow-[inset_10px_0_8px_-8px_rgba(0,0,0,0.5)]",
    "head":
      "relative border-b border-dark-300 bg-dark-100 text-dark-900 after:pointer-events-none after:absolute after:inset-y-2.5 after:end-0 after:w-px after:bg-dark-200 last:after:hidden dark:border-dark-700 dark:bg-dark-800 dark:text-dark-100 dark:after:bg-dark-600",
  },
};
