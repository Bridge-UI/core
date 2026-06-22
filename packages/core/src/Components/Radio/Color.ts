export interface RadioColorItem {
  /**
   * Rest state classes.
   */
  "base": string;

  /**
   * Checked state classes.
   */
  "checked": string;

  /**
   * Focus ring classes.
   */
  "focus": string;
}

export interface RadioColor {
  /**
   * `dark` semantic color palette.
   */
  "dark": RadioColorItem;

  /**
   * `error` semantic color palette.
   */
  "error": RadioColorItem;

  /**
   * Info semantic color palette.
   */
  "info": RadioColorItem;

  /**
   * `primary` semantic color palette.
   */
  "primary": RadioColorItem;

  /**
   * `secondary` semantic color palette.
   */
  "secondary": RadioColorItem;

  /**
   * `success` semantic color palette.
   */
  "success": RadioColorItem;

  /**
   * `warning` semantic color palette.
   */
  "warning": RadioColorItem;
}

export const colorProps: RadioColor = {
  "dark": {
    "focus": "ring-dark-500/30",
    "checked": "bg-dark-600 border-dark-600",
    "base": "border-gray-300 dark:border-gray-600",
  },
  "info": {
    "focus": "ring-info-500/30",
    "checked": "bg-info-600 border-info-600",
    "base": "border-gray-300 dark:border-gray-600",
  },
  "error": {
    "focus": "ring-error-500/30",
    "checked": "bg-error-600 border-error-600",
    "base": "border-gray-300 dark:border-gray-600",
  },
  "primary": {
    "focus": "ring-primary-500/30",
    "base": "border-gray-300 dark:border-gray-600",
    "checked": "bg-primary-600 border-primary-600",
  },
  "success": {
    "focus": "ring-success-500/30",
    "base": "border-gray-300 dark:border-gray-600",
    "checked": "bg-success-600 border-success-600",
  },
  "warning": {
    "focus": "ring-warning-500/30",
    "base": "border-gray-300 dark:border-gray-600",
    "checked": "bg-warning-600 border-warning-600",
  },
  "secondary": {
    "focus": "ring-secondary-500/30",
    "base": "border-gray-300 dark:border-gray-600",
    "checked": "bg-secondary-600 border-secondary-600",
  },
};
