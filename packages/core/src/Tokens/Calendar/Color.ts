/**
 * Interactive states for calendar day / month / year tiles.
 *
 * Pointer hover is pure CSS (`hover:` on the `hover` token). Incomplete range
 * preview uses `data-preview` so the same token’s `data-[preview]:` classes
 * apply without JS-driven hover state.
 *
 * Layout / spacing follows WireUI's datetime-picker calendar chrome.
 */
export interface CalendarColorItem {
  /**
   * Rest state for day tiles — in-month, unselected.
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

  /**
   * Rest state for month / year tiles (WireUI soft fill + border).
   */
  "soft": string;
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

/**
 * Static color maps (Tailwind needs full class strings for scanning).
 * Mirrors WireUI datetime-picker month / year / day tile classes.
 */
export const colorProps: CalendarColor = {
  "dark": {
    "base": "bg-transparent text-gray-700 dark:text-gray-100",
    "disabled":
      "cursor-not-allowed border border-slate-200 bg-slate-200 opacity-50 dark:border-slate-700 dark:bg-slate-800",
    "soft":
      "border border-dark-100 bg-dark-50 font-medium text-slate-600 shadow-xs dark:border-dark-700 dark:bg-dark-900/40 dark:text-gray-200",
    "selected":
      "bg-dark-500 font-semibold text-white hover:bg-dark-400 data-[preview]:bg-dark-500 dark:bg-dark-400 dark:hover:bg-dark-300 dark:data-[preview]:bg-dark-400",
    "hover":
      "hover:bg-dark-100 hover:text-dark-900 data-[preview]:bg-dark-100 data-[preview]:text-dark-900 dark:hover:bg-dark-800/40 dark:hover:text-dark-100 dark:data-[preview]:bg-dark-800/40 dark:data-[preview]:text-dark-100",
  },
  "info": {
    "base": "bg-transparent text-gray-700 dark:text-gray-100",
    "disabled":
      "cursor-not-allowed border border-slate-200 bg-slate-200 opacity-50 dark:border-slate-700 dark:bg-slate-800",
    "soft":
      "border border-info-100 bg-info-50 font-medium text-slate-600 shadow-xs dark:border-info-800 dark:bg-info-950/40 dark:text-gray-200",
    "selected":
      "bg-info-500 font-semibold text-white hover:bg-info-400 data-[preview]:bg-info-500 dark:bg-info-500 dark:hover:bg-info-400 dark:data-[preview]:bg-info-500",
    "hover":
      "hover:bg-info-100 hover:text-info-900 data-[preview]:bg-info-100 data-[preview]:text-info-900 dark:hover:bg-info-900/40 dark:hover:text-info-100 dark:data-[preview]:bg-info-900/40 dark:data-[preview]:text-info-100",
  },
  "error": {
    "base": "bg-transparent text-gray-700 dark:text-gray-100",
    "disabled":
      "cursor-not-allowed border border-slate-200 bg-slate-200 opacity-50 dark:border-slate-700 dark:bg-slate-800",
    "soft":
      "border border-error-100 bg-error-50 font-medium text-slate-600 shadow-xs dark:border-error-800 dark:bg-error-950/40 dark:text-gray-200",
    "selected":
      "bg-error-500 font-semibold text-white hover:bg-error-400 data-[preview]:bg-error-500 dark:bg-error-500 dark:hover:bg-error-400 dark:data-[preview]:bg-error-500",
    "hover":
      "hover:bg-error-100 hover:text-error-900 data-[preview]:bg-error-100 data-[preview]:text-error-900 dark:hover:bg-error-900/40 dark:hover:text-error-100 dark:data-[preview]:bg-error-900/40 dark:data-[preview]:text-error-100",
  },
  "primary": {
    "base": "bg-transparent text-gray-700 dark:text-gray-100",
    "disabled":
      "cursor-not-allowed border border-slate-200 bg-slate-200 opacity-50 dark:border-slate-700 dark:bg-slate-800",
    "soft":
      "border border-primary-100 bg-primary-50 font-medium text-slate-600 shadow-xs dark:border-primary-800 dark:bg-primary-950/40 dark:text-gray-200",
    "selected":
      "bg-primary-500 font-semibold text-white hover:bg-primary-400 data-[preview]:bg-primary-500 dark:bg-primary-500 dark:hover:bg-primary-400 dark:data-[preview]:bg-primary-500",
    "hover":
      "hover:bg-primary-100 hover:text-primary-900 data-[preview]:bg-primary-100 data-[preview]:text-primary-900 dark:hover:bg-primary-900/40 dark:hover:text-primary-100 dark:data-[preview]:bg-primary-900/40 dark:data-[preview]:text-primary-100",
  },
  "success": {
    "base": "bg-transparent text-gray-700 dark:text-gray-100",
    "disabled":
      "cursor-not-allowed border border-slate-200 bg-slate-200 opacity-50 dark:border-slate-700 dark:bg-slate-800",
    "soft":
      "border border-success-100 bg-success-50 font-medium text-slate-600 shadow-xs dark:border-success-800 dark:bg-success-950/40 dark:text-gray-200",
    "selected":
      "bg-success-500 font-semibold text-white hover:bg-success-400 data-[preview]:bg-success-500 dark:bg-success-500 dark:hover:bg-success-400 dark:data-[preview]:bg-success-500",
    "hover":
      "hover:bg-success-100 hover:text-success-900 data-[preview]:bg-success-100 data-[preview]:text-success-900 dark:hover:bg-success-900/40 dark:hover:text-success-100 dark:data-[preview]:bg-success-900/40 dark:data-[preview]:text-success-100",
  },
  "warning": {
    "base": "bg-transparent text-gray-700 dark:text-gray-100",
    "disabled":
      "cursor-not-allowed border border-slate-200 bg-slate-200 opacity-50 dark:border-slate-700 dark:bg-slate-800",
    "soft":
      "border border-warning-100 bg-warning-50 font-medium text-slate-600 shadow-xs dark:border-warning-800 dark:bg-warning-950/40 dark:text-gray-200",
    "selected":
      "bg-warning-500 font-semibold text-white hover:bg-warning-400 data-[preview]:bg-warning-500 dark:bg-warning-500 dark:hover:bg-warning-400 dark:data-[preview]:bg-warning-500",
    "hover":
      "hover:bg-warning-100 hover:text-warning-900 data-[preview]:bg-warning-100 data-[preview]:text-warning-900 dark:hover:bg-warning-900/40 dark:hover:text-warning-100 dark:data-[preview]:bg-warning-900/40 dark:data-[preview]:text-warning-100",
  },
  "secondary": {
    "base": "bg-transparent text-gray-700 dark:text-gray-100",
    "disabled":
      "cursor-not-allowed border border-slate-200 bg-slate-200 opacity-50 dark:border-slate-700 dark:bg-slate-800",
    "soft":
      "border border-secondary-100 bg-secondary-50 font-medium text-slate-600 shadow-xs dark:border-secondary-800 dark:bg-secondary-950/40 dark:text-gray-200",
    "selected":
      "bg-secondary-500 font-semibold text-white hover:bg-secondary-400 data-[preview]:bg-secondary-500 dark:bg-secondary-500 dark:hover:bg-secondary-400 dark:data-[preview]:bg-secondary-500",
    "hover":
      "hover:bg-secondary-100 hover:text-secondary-900 data-[preview]:bg-secondary-100 data-[preview]:text-secondary-900 dark:hover:bg-secondary-900/40 dark:hover:text-secondary-100 dark:data-[preview]:bg-secondary-900/40 dark:data-[preview]:text-secondary-100",
  },
};
