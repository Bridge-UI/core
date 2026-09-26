export interface RatingColorItem {
  /**
   * Unselected icon color.
   */
  "empty": string;

  /**
   * Selected icon color.
   */
  "filled": string;

  /**
   * Focus ring classes.
   */
  "focus": string;
}

export interface RatingColor {
  /**
   * `black` high-contrast palette (black / white only).
   */
  "black": RatingColorItem;

  /**
   * `dark` semantic color palette.
   */
  "dark": RatingColorItem;

  /**
   * `error` semantic color palette.
   */
  "error": RatingColorItem;

  /**
   * Info semantic color palette.
   */
  "info": RatingColorItem;

  /**
   * `primary` semantic color palette.
   */
  "primary": RatingColorItem;

  /**
   * `secondary` semantic color palette.
   */
  "secondary": RatingColorItem;

  /**
   * `success` semantic color palette.
   */
  "success": RatingColorItem;

  /**
   * `warning` semantic color palette.
   */
  "warning": RatingColorItem;
}

export const colorProps: RatingColor = {
  "info": {
    "filled": "text-info-500",
    "focus": "ring-info-500/30",
    "empty": "text-dark-300 dark:text-dark-600",
  },
  "error": {
    "filled": "text-error-500",
    "focus": "ring-error-500/30",
    "empty": "text-dark-300 dark:text-dark-600",
  },
  "primary": {
    "filled": "text-primary-500",
    "focus": "ring-primary-500/30",
    "empty": "text-dark-300 dark:text-dark-600",
  },
  "success": {
    "filled": "text-success-500",
    "focus": "ring-success-500/30",
    "empty": "text-dark-300 dark:text-dark-600",
  },
  "warning": {
    "filled": "text-warning-500",
    "focus": "ring-warning-500/30",
    "empty": "text-dark-300 dark:text-dark-600",
  },
  "secondary": {
    "filled": "text-secondary-500",
    "focus": "ring-secondary-500/30",
    "empty": "text-dark-300 dark:text-dark-600",
  },
  "dark": {
    "focus": "ring-dark-500/30",
    "empty": "text-dark-300 dark:text-dark-600",
    "filled": "text-dark-600 dark:text-dark-300",
  },
  "black": {
    "filled": "text-black dark:text-white",
    "focus": "ring-black/30 dark:ring-white/30",
    "empty": "text-dark-300 dark:text-dark-600",
  },
};
