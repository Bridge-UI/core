/**
 * Interactive states for ColorPicker preset swatches.
 */
export interface ColorPickerColorItem {
  /**
   * Rest state for unselected swatches.
   */
  "base": string;

  /**
   * Disabled / read-only swatch.
   */
  "disabled": string;

  /**
   * Pointer hover highlight.
   */
  "hover": string;

  /**
   * Committed selection ring (do not rely on fill color alone).
   */
  "selected": string;
}

/**
 * Accent colors for ColorPicker preset swatches.
 */
export interface ColorPickerColor {
  /**
   * `dark` semantic selection color.
   */
  "dark": ColorPickerColorItem;

  /**
   * `error` semantic selection color.
   */
  "error": ColorPickerColorItem;

  /**
   * `info` semantic selection color.
   */
  "info": ColorPickerColorItem;

  /**
   * `primary` semantic selection color.
   */
  "primary": ColorPickerColorItem;

  /**
   * `secondary` semantic selection color.
   */
  "secondary": ColorPickerColorItem;

  /**
   * `success` semantic selection color.
   */
  "success": ColorPickerColorItem;

  /**
   * `warning` semantic selection color.
   */
  "warning": ColorPickerColorItem;
}

/**
 * Static color maps (Tailwind needs full class strings for scanning).
 */
export const colorProps: ColorPickerColor = {
  "dark": {
    "disabled": "cursor-not-allowed opacity-50",
    "base": "border border-black/10 dark:border-white/15",
    "selected":
      "ring-2 ring-dark-500 ring-offset-2 ring-offset-white dark:ring-dark-400 dark:ring-offset-dark-900",
    "hover":
      "hover:ring-2 hover:ring-dark-300 hover:ring-offset-2 hover:ring-offset-white dark:hover:ring-dark-500 dark:hover:ring-offset-dark-900",
  },
  "info": {
    "disabled": "cursor-not-allowed opacity-50",
    "base": "border border-black/10 dark:border-white/15",
    "selected":
      "ring-2 ring-info-500 ring-offset-2 ring-offset-white dark:ring-info-400 dark:ring-offset-dark-900",
    "hover":
      "hover:ring-2 hover:ring-info-300 hover:ring-offset-2 hover:ring-offset-white dark:hover:ring-info-500 dark:hover:ring-offset-dark-900",
  },
  "error": {
    "disabled": "cursor-not-allowed opacity-50",
    "base": "border border-black/10 dark:border-white/15",
    "selected":
      "ring-2 ring-error-500 ring-offset-2 ring-offset-white dark:ring-error-400 dark:ring-offset-dark-900",
    "hover":
      "hover:ring-2 hover:ring-error-300 hover:ring-offset-2 hover:ring-offset-white dark:hover:ring-error-500 dark:hover:ring-offset-dark-900",
  },
  "primary": {
    "disabled": "cursor-not-allowed opacity-50",
    "base": "border border-black/10 dark:border-white/15",
    "selected":
      "ring-2 ring-primary-500 ring-offset-2 ring-offset-white dark:ring-primary-400 dark:ring-offset-dark-900",
    "hover":
      "hover:ring-2 hover:ring-primary-300 hover:ring-offset-2 hover:ring-offset-white dark:hover:ring-primary-500 dark:hover:ring-offset-dark-900",
  },
  "success": {
    "disabled": "cursor-not-allowed opacity-50",
    "base": "border border-black/10 dark:border-white/15",
    "selected":
      "ring-2 ring-success-500 ring-offset-2 ring-offset-white dark:ring-success-400 dark:ring-offset-dark-900",
    "hover":
      "hover:ring-2 hover:ring-success-300 hover:ring-offset-2 hover:ring-offset-white dark:hover:ring-success-500 dark:hover:ring-offset-dark-900",
  },
  "warning": {
    "disabled": "cursor-not-allowed opacity-50",
    "base": "border border-black/10 dark:border-white/15",
    "selected":
      "ring-2 ring-warning-500 ring-offset-2 ring-offset-white dark:ring-warning-400 dark:ring-offset-dark-900",
    "hover":
      "hover:ring-2 hover:ring-warning-300 hover:ring-offset-2 hover:ring-offset-white dark:hover:ring-warning-500 dark:hover:ring-offset-dark-900",
  },
  "secondary": {
    "disabled": "cursor-not-allowed opacity-50",
    "base": "border border-black/10 dark:border-white/15",
    "selected":
      "ring-2 ring-secondary-500 ring-offset-2 ring-offset-white dark:ring-secondary-400 dark:ring-offset-dark-900",
    "hover":
      "hover:ring-2 hover:ring-secondary-300 hover:ring-offset-2 hover:ring-offset-white dark:hover:ring-secondary-500 dark:hover:ring-offset-dark-900",
  },
};
