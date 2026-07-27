export interface ProgressColorItem {
  /**
   * Primary progress bar fill classes.
   */
  "bar": string;

  /**
   * Buffer bar fill classes (buffer variant).
   */
  "buffer": string;

  /**
   * Track (background) fill classes.
   */
  "track": string;
}

export interface ProgressColor {
  /**
   * `dark` semantic color palette.
   */
  "dark": ProgressColorItem;

  /**
   * `error` semantic color palette.
   */
  "error": ProgressColorItem;

  /**
   * Info semantic color palette.
   */
  "info": ProgressColorItem;

  /**
   * `primary` semantic color palette.
   */
  "primary": ProgressColorItem;

  /**
   * `secondary` semantic color palette.
   */
  "secondary": ProgressColorItem;

  /**
   * `success` semantic color palette.
   */
  "success": ProgressColorItem;

  /**
   * `warning` semantic color palette.
   */
  "warning": ProgressColorItem;
}

export const colorProps: ProgressColor = {
  "dark": {
    "bar": "bg-dark-500 dark:bg-dark-400",
    "track": "bg-dark-200 dark:bg-dark-800",
    "buffer": "bg-dark-500/30 dark:bg-dark-400/30",
  },
  "info": {
    "bar": "bg-info-500 dark:bg-info-400",
    "track": "bg-info-200 dark:bg-info-800",
    "buffer": "bg-info-500/30 dark:bg-info-400/30",
  },
  "error": {
    "bar": "bg-error-500 dark:bg-error-400",
    "track": "bg-error-200 dark:bg-error-800",
    "buffer": "bg-error-500/30 dark:bg-error-400/30",
  },
  "primary": {
    "bar": "bg-primary-500 dark:bg-primary-400",
    "track": "bg-primary-200 dark:bg-primary-800",
    "buffer": "bg-primary-500/30 dark:bg-primary-400/30",
  },
  "success": {
    "bar": "bg-success-500 dark:bg-success-400",
    "track": "bg-success-200 dark:bg-success-800",
    "buffer": "bg-success-500/30 dark:bg-success-400/30",
  },
  "warning": {
    "bar": "bg-warning-500 dark:bg-warning-400",
    "track": "bg-warning-200 dark:bg-warning-800",
    "buffer": "bg-warning-500/30 dark:bg-warning-400/30",
  },
  "secondary": {
    "bar": "bg-secondary-500 dark:bg-secondary-400",
    "track": "bg-secondary-200 dark:bg-secondary-800",
    "buffer": "bg-secondary-500/30 dark:bg-secondary-400/30",
  },
};
