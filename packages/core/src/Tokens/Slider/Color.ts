export interface SliderColorItem {
  /**
   * Filled bar classes.
   */
  "bar": string;

  /**
   * Focus ring classes for the thumb.
   */
  "focus": string;

  /**
   * Thumb knob border / fill classes.
   */
  "thumb": string;

  /**
   * Track background classes.
   */
  "track": string;
}

export interface SliderColor {
  /**
   * `dark` semantic color palette.
   */
  "dark": SliderColorItem;

  /**
   * `error` semantic color palette.
   */
  "error": SliderColorItem;

  /**
   * Info semantic color palette.
   */
  "info": SliderColorItem;

  /**
   * `primary` semantic color palette.
   */
  "primary": SliderColorItem;

  /**
   * `secondary` semantic color palette.
   */
  "secondary": SliderColorItem;

  /**
   * `success` semantic color palette.
   */
  "success": SliderColorItem;

  /**
   * `warning` semantic color palette.
   */
  "warning": SliderColorItem;
}

export const colorProps: SliderColor = {
  "dark": {
    "focus": "ring-dark-500/30",
    "bar": "bg-dark-600 dark:bg-dark-400",
    "track": "bg-dark-200 dark:bg-dark-700",
    "thumb": "border-dark-600 dark:border-dark-400 bg-white",
  },
  "info": {
    "focus": "ring-info-500/30",
    "bar": "bg-info-600 dark:bg-info-400",
    "track": "bg-dark-200 dark:bg-dark-700",
    "thumb": "border-info-600 dark:border-info-400 bg-white",
  },
  "error": {
    "focus": "ring-error-500/30",
    "bar": "bg-error-600 dark:bg-error-400",
    "track": "bg-dark-200 dark:bg-dark-700",
    "thumb": "border-error-600 dark:border-error-400 bg-white",
  },
  "primary": {
    "focus": "ring-primary-500/30",
    "track": "bg-dark-200 dark:bg-dark-700",
    "bar": "bg-primary-600 dark:bg-primary-400",
    "thumb": "border-primary-600 dark:border-primary-400 bg-white",
  },
  "success": {
    "focus": "ring-success-500/30",
    "track": "bg-dark-200 dark:bg-dark-700",
    "bar": "bg-success-600 dark:bg-success-400",
    "thumb": "border-success-600 dark:border-success-400 bg-white",
  },
  "warning": {
    "focus": "ring-warning-500/30",
    "track": "bg-dark-200 dark:bg-dark-700",
    "bar": "bg-warning-600 dark:bg-warning-400",
    "thumb": "border-warning-600 dark:border-warning-400 bg-white",
  },
  "secondary": {
    "focus": "ring-secondary-500/30",
    "track": "bg-dark-200 dark:bg-dark-700",
    "bar": "bg-secondary-600 dark:bg-secondary-400",
    "thumb": "border-secondary-600 dark:border-secondary-400 bg-white",
  },
};
