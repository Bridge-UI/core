/**
 * Interactive states for calendar day / month / year tiles.
 *
 * `hover` covers both pointer hover and range preview (first date chosen,
 * previewing toward the second). Use `data-preview` on the tile for the
 * in-between days so the same classes apply without a real pointer hover.
 */
export interface CalendarColorItem {
  /**
   * Rest state — in-month, unselected.
   */
  "base": string;

  /**
   * Disabled / read-only tile.
   */
  "disabled": string;

  /**
   * Pointer hover and range-preview highlight.
   * Includes `hover:` and `data-[preview]:` variants.
   */
  "hover": string;

  /**
   * Committed selection (single, multiple, or range endpoints / fill).
   */
  "selected": string;
}

/**
 * Calendar accent colors for day / month / year tiles.
 */
export interface CalendarColor {
  /**
   * `dark` semantic selection color.
   */
  "dark": CalendarColorItem;

  /**
   * `error` semantic selection color.
   */
  "error": CalendarColorItem;

  /**
   * `info` semantic selection color.
   */
  "info": CalendarColorItem;

  /**
   * `primary` semantic selection color.
   */
  "primary": CalendarColorItem;

  /**
   * `secondary` semantic selection color.
   */
  "secondary": CalendarColorItem;

  /**
   * `success` semantic selection color.
   */
  "success": CalendarColorItem;

  /**
   * `warning` semantic selection color.
   */
  "warning": CalendarColorItem;
}

export const colorProps: CalendarColor = {
  "dark": {
    "base": "bg-transparent text-gray-800 dark:text-gray-100",
    "disabled":
      "cursor-not-allowed bg-transparent text-gray-300 opacity-50 dark:text-gray-600",
    "selected":
      "bg-dark-600 text-white hover:bg-dark-700 data-[preview]:bg-dark-600 dark:bg-dark-400 dark:hover:bg-dark-300 dark:data-[preview]:bg-dark-400",
    "hover":
      "hover:bg-dark-100 hover:text-dark-800 data-[preview]:bg-dark-100 data-[preview]:text-dark-800 dark:hover:bg-dark-800/40 dark:hover:text-dark-100 dark:data-[preview]:bg-dark-800/40 dark:data-[preview]:text-dark-100",
  },
  "info": {
    "base": "bg-transparent text-gray-800 dark:text-gray-100",
    "disabled":
      "cursor-not-allowed bg-transparent text-gray-300 opacity-50 dark:text-gray-600",
    "selected":
      "bg-info-600 text-white hover:bg-info-700 data-[preview]:bg-info-600 dark:bg-info-500 dark:hover:bg-info-400 dark:data-[preview]:bg-info-500",
    "hover":
      "hover:bg-info-100 hover:text-info-800 data-[preview]:bg-info-100 data-[preview]:text-info-800 dark:hover:bg-info-900/40 dark:hover:text-info-100 dark:data-[preview]:bg-info-900/40 dark:data-[preview]:text-info-100",
  },
  "error": {
    "base": "bg-transparent text-gray-800 dark:text-gray-100",
    "disabled":
      "cursor-not-allowed bg-transparent text-gray-300 opacity-50 dark:text-gray-600",
    "selected":
      "bg-error-600 text-white hover:bg-error-700 data-[preview]:bg-error-600 dark:bg-error-500 dark:hover:bg-error-400 dark:data-[preview]:bg-error-500",
    "hover":
      "hover:bg-error-100 hover:text-error-800 data-[preview]:bg-error-100 data-[preview]:text-error-800 dark:hover:bg-error-900/40 dark:hover:text-error-100 dark:data-[preview]:bg-error-900/40 dark:data-[preview]:text-error-100",
  },
  "primary": {
    "base": "bg-transparent text-gray-800 dark:text-gray-100",
    "disabled":
      "cursor-not-allowed bg-transparent text-gray-300 opacity-50 dark:text-gray-600",
    "selected":
      "bg-primary-600 text-white hover:bg-primary-700 data-[preview]:bg-primary-600 dark:bg-primary-500 dark:hover:bg-primary-400 dark:data-[preview]:bg-primary-500",
    "hover":
      "hover:bg-primary-100 hover:text-primary-800 data-[preview]:bg-primary-100 data-[preview]:text-primary-800 dark:hover:bg-primary-900/40 dark:hover:text-primary-100 dark:data-[preview]:bg-primary-900/40 dark:data-[preview]:text-primary-100",
  },
  "success": {
    "base": "bg-transparent text-gray-800 dark:text-gray-100",
    "disabled":
      "cursor-not-allowed bg-transparent text-gray-300 opacity-50 dark:text-gray-600",
    "selected":
      "bg-success-600 text-white hover:bg-success-700 data-[preview]:bg-success-600 dark:bg-success-500 dark:hover:bg-success-400 dark:data-[preview]:bg-success-500",
    "hover":
      "hover:bg-success-100 hover:text-success-800 data-[preview]:bg-success-100 data-[preview]:text-success-800 dark:hover:bg-success-900/40 dark:hover:text-success-100 dark:data-[preview]:bg-success-900/40 dark:data-[preview]:text-success-100",
  },
  "warning": {
    "base": "bg-transparent text-gray-800 dark:text-gray-100",
    "disabled":
      "cursor-not-allowed bg-transparent text-gray-300 opacity-50 dark:text-gray-600",
    "selected":
      "bg-warning-600 text-white hover:bg-warning-700 data-[preview]:bg-warning-600 dark:bg-warning-500 dark:hover:bg-warning-400 dark:data-[preview]:bg-warning-500",
    "hover":
      "hover:bg-warning-100 hover:text-warning-800 data-[preview]:bg-warning-100 data-[preview]:text-warning-800 dark:hover:bg-warning-900/40 dark:hover:text-warning-100 dark:data-[preview]:bg-warning-900/40 dark:data-[preview]:text-warning-100",
  },
  "secondary": {
    "base": "bg-transparent text-gray-800 dark:text-gray-100",
    "disabled":
      "cursor-not-allowed bg-transparent text-gray-300 opacity-50 dark:text-gray-600",
    "selected":
      "bg-secondary-600 text-white hover:bg-secondary-700 data-[preview]:bg-secondary-600 dark:bg-secondary-500 dark:hover:bg-secondary-400 dark:data-[preview]:bg-secondary-500",
    "hover":
      "hover:bg-secondary-100 hover:text-secondary-800 data-[preview]:bg-secondary-100 data-[preview]:text-secondary-800 dark:hover:bg-secondary-900/40 dark:hover:text-secondary-100 dark:data-[preview]:bg-secondary-900/40 dark:data-[preview]:text-secondary-100",
  },
};
