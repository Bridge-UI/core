/**
 * Interactive states for time column tiles.
 */
export interface TimeColorItem {
  /**
   * Rest state for unselected tiles.
   */
  "base": string;

  /**
   * Disabled / read-only tile.
   */
  "disabled": string;

  /**
   * Pointer hover highlight.
   */
  "hover": string;

  /**
   * Committed selection.
   */
  "selected": string;
}

/**
 * Time accent colors for column tiles.
 */
export interface TimeColor {
  /**
   * `dark` semantic selection color.
   */
  "dark": TimeColorItem;

  /**
   * `error` semantic selection color.
   */
  "error": TimeColorItem;

  /**
   * `info` semantic selection color.
   */
  "info": TimeColorItem;

  /**
   * `primary` semantic selection color.
   */
  "primary": TimeColorItem;

  /**
   * `secondary` semantic selection color.
   */
  "secondary": TimeColorItem;

  /**
   * `success` semantic selection color.
   */
  "success": TimeColorItem;

  /**
   * `warning` semantic selection color.
   */
  "warning": TimeColorItem;
}

/**
 * Static color maps (Tailwind needs full class strings for scanning).
 */
export const colorProps: TimeColor = {
  "dark": {
    "base": "bg-transparent text-dark-700 dark:text-dark-100",
    "hover":
      "hover:bg-dark-100 hover:text-dark-900 dark:hover:bg-dark-800/40 dark:hover:text-dark-100",
    "selected":
      "bg-dark-500 font-semibold text-white hover:bg-dark-400 dark:bg-dark-400 dark:hover:bg-dark-300",
    "disabled":
      "cursor-not-allowed border border-slate-200 bg-slate-200 opacity-50 dark:border-slate-700 dark:bg-slate-800",
  },
  "info": {
    "base": "bg-transparent text-dark-700 dark:text-dark-100",
    "hover":
      "hover:bg-info-100 hover:text-info-900 dark:hover:bg-info-900/40 dark:hover:text-info-100",
    "selected":
      "bg-info-500 font-semibold text-white hover:bg-info-400 dark:bg-info-500 dark:hover:bg-info-400",
    "disabled":
      "cursor-not-allowed border border-slate-200 bg-slate-200 opacity-50 dark:border-slate-700 dark:bg-slate-800",
  },
  "error": {
    "base": "bg-transparent text-dark-700 dark:text-dark-100",
    "hover":
      "hover:bg-error-100 hover:text-error-900 dark:hover:bg-error-900/40 dark:hover:text-error-100",
    "selected":
      "bg-error-500 font-semibold text-white hover:bg-error-400 dark:bg-error-500 dark:hover:bg-error-400",
    "disabled":
      "cursor-not-allowed border border-slate-200 bg-slate-200 opacity-50 dark:border-slate-700 dark:bg-slate-800",
  },
  "primary": {
    "base": "bg-transparent text-dark-700 dark:text-dark-100",
    "hover":
      "hover:bg-primary-100 hover:text-primary-900 dark:hover:bg-primary-900/40 dark:hover:text-primary-100",
    "disabled":
      "cursor-not-allowed border border-slate-200 bg-slate-200 opacity-50 dark:border-slate-700 dark:bg-slate-800",
    "selected":
      "bg-primary-500 font-semibold text-white hover:bg-primary-400 dark:bg-primary-500 dark:hover:bg-primary-400",
  },
  "success": {
    "base": "bg-transparent text-dark-700 dark:text-dark-100",
    "hover":
      "hover:bg-success-100 hover:text-success-900 dark:hover:bg-success-900/40 dark:hover:text-success-100",
    "disabled":
      "cursor-not-allowed border border-slate-200 bg-slate-200 opacity-50 dark:border-slate-700 dark:bg-slate-800",
    "selected":
      "bg-success-500 font-semibold text-white hover:bg-success-400 dark:bg-success-500 dark:hover:bg-success-400",
  },
  "warning": {
    "base": "bg-transparent text-dark-700 dark:text-dark-100",
    "hover":
      "hover:bg-warning-100 hover:text-warning-900 dark:hover:bg-warning-900/40 dark:hover:text-warning-100",
    "disabled":
      "cursor-not-allowed border border-slate-200 bg-slate-200 opacity-50 dark:border-slate-700 dark:bg-slate-800",
    "selected":
      "bg-warning-500 font-semibold text-white hover:bg-warning-400 dark:bg-warning-500 dark:hover:bg-warning-400",
  },
  "secondary": {
    "base": "bg-transparent text-dark-700 dark:text-dark-100",
    "hover":
      "hover:bg-secondary-100 hover:text-secondary-900 dark:hover:bg-secondary-900/40 dark:hover:text-secondary-100",
    "disabled":
      "cursor-not-allowed border border-slate-200 bg-slate-200 opacity-50 dark:border-slate-700 dark:bg-slate-800",
    "selected":
      "bg-secondary-500 font-semibold text-white hover:bg-secondary-400 dark:bg-secondary-500 dark:hover:bg-secondary-400",
  },
};
