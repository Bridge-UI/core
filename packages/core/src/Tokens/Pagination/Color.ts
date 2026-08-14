/**
 * Per-color selected-state classes for pagination.
 * Inactive controls use `dark-*` from the variant; these apply when selected.
 */
export interface PaginationColorItem {
  /**
   * Text / border accent for `text` and `ghost` selected pages.
   */
  "itemSelectedAccent": string;

  /**
   * Solid fill for the selected page in `outlined`.
   */
  "itemSelectedFilled": string;

  /**
   * Soft background tint for the selected page in `ghost`.
   */
  "itemSelectedSoft": string;
}

/**
 * Pagination color tokens (selected accent).
 */
export interface PaginationColor {
  /**
   * `dark` semantic color palette.
   */
  "dark": PaginationColorItem;

  /**
   * `error` semantic color palette.
   */
  "error": PaginationColorItem;

  /**
   * Info semantic color palette.
   */
  "info": PaginationColorItem;

  /**
   * `primary` semantic color palette.
   */
  "primary": PaginationColorItem;

  /**
   * `secondary` semantic color palette.
   */
  "secondary": PaginationColorItem;

  /**
   * `success` semantic color palette.
   */
  "success": PaginationColorItem;

  /**
   * `warning` semantic color palette.
   */
  "warning": PaginationColorItem;
}

/**
 * Default pagination color maps (selected only).
 */
export const colorProps: PaginationColor = {
  "info": {
    "itemSelectedSoft": "bg-info-500/15 dark:bg-info-500/20",
    "itemSelectedFilled":
      "bg-info-600 text-white ring-info-600 hover:bg-info-600 hover:text-white dark:bg-info-500 dark:ring-info-500 dark:hover:bg-info-500",
    "itemSelectedAccent":
      "border-info-500 text-info-600 hover:border-info-500 hover:text-info-600 dark:border-info-400 dark:text-info-400 dark:hover:border-info-400 dark:hover:text-info-400",
  },
  "error": {
    "itemSelectedSoft": "bg-error-500/15 dark:bg-error-500/20",
    "itemSelectedFilled":
      "bg-error-600 text-white ring-error-600 hover:bg-error-600 hover:text-white dark:bg-error-500 dark:ring-error-500 dark:hover:bg-error-500",
    "itemSelectedAccent":
      "border-error-500 text-error-600 hover:border-error-500 hover:text-error-600 dark:border-error-400 dark:text-error-400 dark:hover:border-error-400 dark:hover:text-error-400",
  },
  "dark": {
    "itemSelectedSoft": "bg-dark-500/10 dark:bg-dark-500/20",
    "itemSelectedAccent":
      "border-dark-700 text-dark-800 hover:border-dark-700 hover:text-dark-800 dark:border-dark-200 dark:text-dark-100 dark:hover:border-dark-200 dark:hover:text-dark-100",
    "itemSelectedFilled":
      "bg-dark-700 text-white ring-dark-700 hover:bg-dark-700 hover:text-white dark:bg-dark-200 dark:text-dark-900 dark:ring-dark-200 dark:hover:bg-dark-200 dark:hover:text-dark-900",
  },
  "warning": {
    "itemSelectedSoft": "bg-warning-500/15 dark:bg-warning-500/20",
    "itemSelectedFilled":
      "bg-warning-600 text-white ring-warning-600 hover:bg-warning-600 hover:text-white dark:bg-warning-500 dark:ring-warning-500 dark:hover:bg-warning-500",
    "itemSelectedAccent":
      "border-warning-500 text-warning-600 hover:border-warning-500 hover:text-warning-600 dark:border-warning-400 dark:text-warning-400 dark:hover:border-warning-400 dark:hover:text-warning-400",
  },
  "success": {
    "itemSelectedSoft": "bg-success-500/15 dark:bg-success-500/20",
    "itemSelectedFilled":
      "bg-success-600 text-white ring-success-600 hover:bg-success-600 hover:text-white dark:bg-success-500 dark:ring-success-500 dark:hover:bg-success-500",
    "itemSelectedAccent":
      "border-success-500 text-success-600 hover:border-success-500 hover:text-success-600 dark:border-success-400 dark:text-success-400 dark:hover:border-success-400 dark:hover:text-success-400",
  },
  "secondary": {
    "itemSelectedSoft": "bg-secondary-500/15 dark:bg-secondary-500/20",
    "itemSelectedFilled":
      "bg-secondary-600 text-white ring-secondary-600 hover:bg-secondary-600 hover:text-white dark:bg-secondary-500 dark:ring-secondary-500 dark:hover:bg-secondary-500",
    "itemSelectedAccent":
      "border-secondary-500 text-secondary-600 hover:border-secondary-500 hover:text-secondary-600 dark:border-secondary-400 dark:text-secondary-400 dark:hover:border-secondary-400 dark:hover:text-secondary-400",
  },
  "primary": {
    "itemSelectedSoft": "bg-primary-500/15 dark:bg-primary-500/20",
    "itemSelectedAccent":
      "border-primary-500 text-primary-600 hover:border-primary-500 hover:text-primary-600 dark:border-primary-400 dark:text-primary-400 dark:hover:border-primary-400 dark:hover:text-primary-400",
    "itemSelectedFilled":
      "bg-primary-600 text-white ring-primary-600 hover:bg-primary-600 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 dark:bg-primary-500 dark:ring-primary-500 dark:hover:bg-primary-500",
  },
};
