/**
 * Per-variant structural classes for the pagination list and controls.
 * Inactive text uses `dark-*`; selected text comes from color tokens.
 * Selected surface (ring, underline, fill) lives on `itemSelected`.
 * Corner radius comes from the `rounded` token (not hardcoded here).
 */
export interface PaginationVariantItem {
  /**
   * Classes for ellipsis placeholders.
   */
  "ellipsis": string;

  /**
   * Classes for each page / prev / next control (unselected base).
   */
  "item": string;

  /**
   * Extra structural classes for the selected page (combine with color text).
   */
  "itemSelected": string;

  /**
   * Classes for the ordered list container.
   */
  "list": string;
}

/**
 * Pagination visual variants.
 *
 * - `ghost` — spaced outline buttons. Default.
 * - `outlined` — connected controls with shared ring borders.
 * - `text` — underline on the active page.
 */
export interface PaginationVariant {
  /**
   * Soft spaced buttons. Quiet option without connecting rings. Default.
   */
  "ghost": PaginationVariantItem;

  /**
   * Connected ringed controls with a quiet selected fill.
   */
  "outlined": PaginationVariantItem;

  /**
   * Underline on the active page.
   */
  "text": PaginationVariantItem;
}

/**
 * Default pagination variant class maps.
 */
export const variantProps: PaginationVariant = {
  "text": {
    "ellipsis": "",
    "list": "gap-2",
    "itemSelected": "underline underline-offset-4",
    "item":
      "text-dark-500 hover:bg-dark-500/10 hover:text-dark-800 dark:text-dark-400 dark:hover:bg-dark-500/15 dark:hover:text-dark-200",
  },
  "ghost": {
    "ellipsis": "",
    "list": "gap-2",
    "itemSelected":
      "bg-white ring-1 ring-inset ring-dark-400 dark:bg-dark-900 dark:ring-dark-500",
    "item":
      "text-dark-600 hover:bg-dark-500/10 hover:text-dark-800 dark:text-dark-400 dark:hover:bg-dark-500/15 dark:hover:text-dark-200",
  },
  "outlined": {
    "list": "isolate",
    "itemSelected": "z-10 bg-dark-100 dark:bg-dark-800",
    "ellipsis":
      "relative -ml-px rounded-none ring-1 ring-inset ring-dark-300 dark:ring-dark-600 text-dark-500 dark:text-dark-400",
    "item":
      "relative -ml-px rounded-none ring-1 ring-inset ring-dark-300 text-dark-700 hover:bg-dark-500/5 dark:ring-dark-600 dark:text-dark-200 dark:hover:bg-dark-500/10",
  },
};
