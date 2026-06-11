export interface ListboxColorItem {
  /**
   * Check icon on selected options.
   */
  "check": string;

  /**
   * Selected or keyboard-highlighted option row.
   */
  "selected": string;
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
    "selected":
      "bg-dark-50 text-dark-700 dark:bg-dark-900/40 dark:text-dark-200",
  },
  "info": {
    "check": "text-info-600 dark:text-info-400",
    "selected":
      "bg-info-50 text-info-700 dark:bg-info-950/40 dark:text-info-300",
  },
  "error": {
    "check": "text-error-600 dark:text-error-400",
    "selected":
      "bg-error-50 text-error-700 dark:bg-error-950/40 dark:text-error-300",
  },
  "primary": {
    "check": "text-primary-600 dark:text-primary-400",
    "selected":
      "bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-300",
  },
  "success": {
    "check": "text-success-600 dark:text-success-400",
    "selected":
      "bg-success-50 text-success-700 dark:bg-success-950/40 dark:text-success-300",
  },
  "warning": {
    "check": "text-warning-600 dark:text-warning-400",
    "selected":
      "bg-warning-50 text-warning-700 dark:bg-warning-950/40 dark:text-warning-300",
  },
  "secondary": {
    "check": "text-secondary-600 dark:text-secondary-400",
    "selected":
      "bg-secondary-50 text-secondary-700 dark:bg-secondary-950/40 dark:text-secondary-300",
  },
};
