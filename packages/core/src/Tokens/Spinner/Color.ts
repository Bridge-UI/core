export interface SpinnerColorItem {
  /**
   * Progress circle stroke classes.
   */
  "circle": string;

  /**
   * Track circle stroke classes.
   */
  "track": string;
}

export interface SpinnerColor {
  /**
   * `black` high-contrast palette (black / white only).
   */
  "black": SpinnerColorItem;

  /**
   * `dark` semantic color palette.
   */
  "dark": SpinnerColorItem;

  /**
   * `error` semantic color palette.
   */
  "error": SpinnerColorItem;

  /**
   * Info semantic color palette.
   */
  "info": SpinnerColorItem;

  /**
   * `primary` semantic color palette.
   */
  "primary": SpinnerColorItem;

  /**
   * `secondary` semantic color palette.
   */
  "secondary": SpinnerColorItem;

  /**
   * `success` semantic color palette.
   */
  "success": SpinnerColorItem;

  /**
   * `warning` semantic color palette.
   */
  "warning": SpinnerColorItem;
}

export const colorProps: SpinnerColor = {
  "black": {
    "circle": "stroke-black dark:stroke-white",
    "track": "stroke-black/20 dark:stroke-white/20",
  },
  "dark": {
    "track": "stroke-dark-200 dark:stroke-dark-800",
    "circle": "stroke-dark-500 dark:stroke-dark-400",
  },
  "info": {
    "track": "stroke-info-200 dark:stroke-info-800",
    "circle": "stroke-info-500 dark:stroke-info-400",
  },
  "error": {
    "track": "stroke-error-200 dark:stroke-error-800",
    "circle": "stroke-error-500 dark:stroke-error-400",
  },
  "primary": {
    "track": "stroke-primary-200 dark:stroke-primary-800",
    "circle": "stroke-primary-500 dark:stroke-primary-400",
  },
  "success": {
    "track": "stroke-success-200 dark:stroke-success-800",
    "circle": "stroke-success-500 dark:stroke-success-400",
  },
  "warning": {
    "track": "stroke-warning-200 dark:stroke-warning-800",
    "circle": "stroke-warning-500 dark:stroke-warning-400",
  },
  "secondary": {
    "track": "stroke-secondary-200 dark:stroke-secondary-800",
    "circle": "stroke-secondary-500 dark:stroke-secondary-400",
  },
};
