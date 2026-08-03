export interface TooltipColorItem {
  /**
   * Arrow fill color classes (matches content background).
   */
  "arrow": string;

  /**
   * Content background and text color classes.
   */
  "content": string;
}

export interface TooltipColor {
  /**
   * `dark` semantic color palette.
   */
  "dark": TooltipColorItem;

  /**
   * `error` semantic color palette.
   */
  "error": TooltipColorItem;

  /**
   * Info semantic color palette.
   */
  "info": TooltipColorItem;

  /**
   * `primary` semantic color palette.
   */
  "primary": TooltipColorItem;

  /**
   * `secondary` semantic color palette.
   */
  "secondary": TooltipColorItem;

  /**
   * `success` semantic color palette.
   */
  "success": TooltipColorItem;

  /**
   * `warning` semantic color palette.
   */
  "warning": TooltipColorItem;
}

export const colorProps: TooltipColor = {
  "info": {
    "arrow": "bg-info-600",
    "content": "bg-info-600 text-white",
  },
  "error": {
    "arrow": "bg-error-600",
    "content": "bg-error-600 text-white",
  },
  "primary": {
    "arrow": "bg-primary-600",
    "content": "bg-primary-600 text-white",
  },
  "success": {
    "arrow": "bg-success-600",
    "content": "bg-success-600 text-white",
  },
  "warning": {
    "arrow": "bg-warning-600",
    "content": "bg-warning-600 text-white",
  },
  "dark": {
    "arrow": "bg-dark-900 dark:bg-dark-100",
    "content": "bg-dark-900 text-white dark:bg-dark-100 dark:text-dark-900",
  },
  "secondary": {
    "arrow": "bg-secondary-700 dark:bg-secondary-300",
    "content":
      "bg-secondary-700 text-white dark:bg-secondary-300 dark:text-secondary-900",
  },
};
