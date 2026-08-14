/**
 * Per-variant structural classes for the pagination list and controls.
 * Inactive text uses `dark-*`; selected accents come from color tokens.
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
   * Extra structural classes for the selected page (combine with color).
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
 * - `text` — top border underline on the active page (border-t style).
 * - `outlined` — connected controls with shared ring borders.
 * - `ghost` — soft spaced buttons with rounded corners.
 */
export interface PaginationVariant {
  /**
   * Soft spaced buttons. Quiet option without connecting rings.
   */
  "ghost": PaginationVariantItem;

  /**
   * Connected ringed controls with a filled selected page. Default companion
   * to dense table footers.
   */
  "outlined": PaginationVariantItem;

  /**
   * Underline / border-top indicator on the active page. Default.
   */
  "text": PaginationVariantItem;
}

/**
 * Default pagination variant class maps.
 */
export const variantProps: PaginationVariant = {
  "ghost": {
    "list": "gap-1",
    "itemSelected": "",
    "ellipsis": "rounded-md",
    "item":
      "rounded-md text-dark-600 hover:bg-dark-500/10 hover:text-dark-800 dark:text-dark-400 dark:hover:bg-dark-500/15 dark:hover:text-dark-200",
  },
  "text": {
    "itemSelected": "",
    "ellipsis": "border-t-2 border-transparent",
    "list": "gap-0 border-t border-dark-200 dark:border-dark-700",
    "item":
      "rounded-none border-t-2 border-transparent -mt-px text-dark-500 hover:border-dark-300 hover:text-dark-700 dark:text-dark-400 dark:hover:border-dark-600 dark:hover:text-dark-200",
  },
  "outlined": {
    "itemSelected": "z-10",
    "ellipsis":
      "ring-1 ring-inset ring-dark-300 dark:ring-dark-600 text-dark-500 dark:text-dark-400",
    "list":
      "isolate -space-x-px overflow-hidden rounded-md shadow-sm ring-1 ring-dark-300 dark:ring-dark-600",
    "item":
      "rounded-none ring-1 ring-inset ring-dark-300 text-dark-700 hover:bg-dark-500/5 dark:ring-dark-600 dark:text-dark-200 dark:hover:bg-dark-500/10",
  },
};
