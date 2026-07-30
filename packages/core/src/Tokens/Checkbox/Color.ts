export interface CheckboxColorItem {
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

export interface CheckboxColor {
  /**
   * `dark` semantic color palette.
   */
  "dark": CheckboxColorItem;

  /**
   * `error` semantic color palette.
   */
  "error": CheckboxColorItem;

  /**
   * Info semantic color palette.
   */
  "info": CheckboxColorItem;

  /**
   * `primary` semantic color palette.
   */
  "primary": CheckboxColorItem;

  /**
   * `secondary` semantic color palette.
   */
  "secondary": CheckboxColorItem;

  /**
   * `success` semantic color palette.
   */
  "success": CheckboxColorItem;

  /**
   * `warning` semantic color palette.
   */
  "warning": CheckboxColorItem;
}

export const colorProps: CheckboxColor = {
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
