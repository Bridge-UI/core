export interface LinkColorItem {
  /**
   * Rest link color classes.
   */
  "base": string;

  /**
   * Hover link color classes.
   */
  "hover": string;
}

export interface LinkColor {
  /**
   * `dark` semantic color palette.
   */
  "dark": LinkColorItem;

  /**
   * `error` semantic color palette.
   */
  "error": LinkColorItem;

  /**
   * Info semantic color palette.
   */
  "info": LinkColorItem;

  /**
   * `primary` semantic color palette.
   */
  "primary": LinkColorItem;

  /**
   * `secondary` semantic color palette.
   */
  "secondary": LinkColorItem;

  /**
   * `success` semantic color palette.
   */
  "success": LinkColorItem;

  /**
   * `warning` semantic color palette.
   */
  "warning": LinkColorItem;
}

export const colorProps: LinkColor = {
  "dark": {
    "base": "text-dark-600 dark:text-dark-400",
    "hover": "hover:text-dark-800 dark:hover:text-dark-200",
  },
  "info": {
    "base": "text-info-600 dark:text-info-400",
    "hover": "hover:text-info-800 dark:hover:text-info-200",
  },
  "error": {
    "base": "text-error-600 dark:text-error-400",
    "hover": "hover:text-error-800 dark:hover:text-error-200",
  },
  "primary": {
    "base": "text-primary-600 dark:text-primary-400",
    "hover": "hover:text-primary-800 dark:hover:text-primary-200",
  },
  "success": {
    "base": "text-success-600 dark:text-success-400",
    "hover": "hover:text-success-800 dark:hover:text-success-200",
  },
  "warning": {
    "base": "text-warning-600 dark:text-warning-400",
    "hover": "hover:text-warning-800 dark:hover:text-warning-200",
  },
  "secondary": {
    "base": "text-secondary-600 dark:text-secondary-400",
    "hover": "hover:text-secondary-800 dark:hover:text-secondary-200",
  },
};
