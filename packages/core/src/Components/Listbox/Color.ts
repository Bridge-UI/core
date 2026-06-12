export interface ListboxColorItem {
  /**
   * Check icon on selected options.
   */
  "check": string;

  /**
   * Clear icon in the combobox trigger (rest + hover).
   */
  "clear": string;

  /**
   * Keyboard-highlighted option row.
   */
  "highlighted": string;

  /**
   * Selected option row.
   */
  "selected": string;

  /**
   * Selected value text in a combobox trigger (single select).
   */
  "value": string;
}

export interface ListboxColor {
  "dark": ListboxColorItem;
  "error": ListboxColorItem;
  "info": ListboxColorItem;
  "primary": ListboxColorItem;
  "secondary": ListboxColorItem;
  "success": ListboxColorItem;
  "warning": ListboxColorItem;
}

export const colorProps: ListboxColor = {
  "dark": {
    "check": "text-dark-600 dark:text-dark-400",
    "value": "text-dark-700 dark:text-dark-200",
    "highlighted": "bg-black/5 dark:bg-white/10",
    "selected":
      "bg-dark-50 text-dark-700 dark:bg-dark-900/40 dark:text-dark-200",
    "clear":
      "text-gray-400 hover:text-dark-600 dark:text-gray-500 dark:hover:text-dark-400",
  },
  "info": {
    "check": "text-info-600 dark:text-info-400",
    "value": "text-info-700 dark:text-info-300",
    "highlighted": "bg-black/5 dark:bg-white/10",
    "selected":
      "bg-info-50 text-info-700 dark:bg-info-950/40 dark:text-info-300",
    "clear":
      "text-gray-400 hover:text-info-600 dark:text-gray-500 dark:hover:text-info-400",
  },
  "error": {
    "highlighted": "bg-black/5 dark:bg-white/10",
    "check": "text-error-600 dark:text-error-400",
    "value": "text-error-700 dark:text-error-300",
    "selected":
      "bg-error-50 text-error-700 dark:bg-error-950/40 dark:text-error-300",
    "clear":
      "text-gray-400 hover:text-error-600 dark:text-gray-500 dark:hover:text-error-400",
  },
  "primary": {
    "highlighted": "bg-black/5 dark:bg-white/10",
    "check": "text-primary-600 dark:text-primary-400",
    "value": "text-primary-700 dark:text-primary-300",
    "selected":
      "bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-300",
    "clear":
      "text-gray-400 hover:text-primary-600 dark:text-gray-500 dark:hover:text-primary-400",
  },
  "success": {
    "highlighted": "bg-black/5 dark:bg-white/10",
    "check": "text-success-600 dark:text-success-400",
    "value": "text-success-700 dark:text-success-300",
    "selected":
      "bg-success-50 text-success-700 dark:bg-success-950/40 dark:text-success-300",
    "clear":
      "text-gray-400 hover:text-success-600 dark:text-gray-500 dark:hover:text-success-400",
  },
  "warning": {
    "highlighted": "bg-black/5 dark:bg-white/10",
    "check": "text-warning-600 dark:text-warning-400",
    "value": "text-warning-700 dark:text-warning-300",
    "selected":
      "bg-warning-50 text-warning-700 dark:bg-warning-950/40 dark:text-warning-300",
    "clear":
      "text-gray-400 hover:text-warning-600 dark:text-gray-500 dark:hover:text-warning-400",
  },
  "secondary": {
    "highlighted": "bg-black/5 dark:bg-white/10",
    "check": "text-secondary-600 dark:text-secondary-400",
    "value": "text-secondary-700 dark:text-secondary-300",
    "selected":
      "bg-secondary-50 text-secondary-700 dark:bg-secondary-950/40 dark:text-secondary-300",
    "clear":
      "text-gray-400 hover:text-secondary-600 dark:text-gray-500 dark:hover:text-secondary-400",
  },
};
