/**
 * Per-color accent classes for completed / active stepper parts.
 * Upcoming neutrals live on chrome tokens. Error uses the `error` palette.
 */
export interface StepperColorItem {
  /**
   * Filled completed indicator (background + glyph).
   */
  "completed": string;

  /**
   * Hover darkening for a clickable completed indicator.
   */
  "completedHover": string;

  /**
   * Connector line once the step behind it is completed.
   */
  "connector": string;

  /**
   * Active indicator border and glyph color.
   */
  "indicator": string;

  /**
   * Active label text.
   */
  "label": string;
}

/**
 * Stepper color tokens (active / completed accent).
 */
export interface StepperColor {
  /**
   * `black` high-contrast palette (black / white only).
   */
  "black": StepperColorItem;

  /**
   * `dark` semantic color palette.
   */
  "dark": StepperColorItem;

  /**
   * `error` semantic color palette.
   */
  "error": StepperColorItem;

  /**
   * Info semantic color palette.
   */
  "info": StepperColorItem;

  /**
   * `primary` semantic color palette.
   */
  "primary": StepperColorItem;

  /**
   * `secondary` semantic color palette.
   */
  "secondary": StepperColorItem;

  /**
   * `success` semantic color palette.
   */
  "success": StepperColorItem;

  /**
   * `warning` semantic color palette.
   */
  "warning": StepperColorItem;
}

/**
 * Default stepper color maps (active / completed accent).
 */
export const colorProps: StepperColor = {
  "black": {
    "label": "text-black dark:text-white",
    "connector": "bg-black dark:bg-white",
    "completedHover": "group-hover:bg-black/80 dark:group-hover:bg-white/80",
    "indicator": "border-black text-black dark:border-white dark:text-white",
    "completed":
      "border-transparent bg-black text-white dark:bg-white dark:text-black",
  },
  "info": {
    "label": "text-info-600 dark:text-info-400",
    "connector": "bg-info-600 dark:bg-info-400",
    "completedHover": "group-hover:bg-info-800 dark:group-hover:bg-info-400",
    "completed": "border-transparent bg-info-600 text-white dark:bg-info-500",
    "indicator":
      "border-info-600 text-info-600 dark:border-info-400 dark:text-info-400",
  },
  "error": {
    "label": "text-error-600 dark:text-error-400",
    "connector": "bg-error-600 dark:bg-error-400",
    "completedHover": "group-hover:bg-error-800 dark:group-hover:bg-error-400",
    "completed": "border-transparent bg-error-600 text-white dark:bg-error-500",
    "indicator":
      "border-error-600 text-error-600 dark:border-error-400 dark:text-error-400",
  },
  "dark": {
    "label": "text-dark-800 dark:text-dark-100",
    "connector": "bg-dark-700 dark:bg-dark-300",
    "completedHover": "group-hover:bg-dark-900 dark:group-hover:bg-dark-50",
    "indicator":
      "border-dark-800 text-dark-800 dark:border-dark-100 dark:text-dark-100",
    "completed":
      "border-transparent bg-dark-800 text-white dark:bg-dark-200 dark:text-dark-900",
  },
  "primary": {
    "label": "text-primary-600 dark:text-primary-400",
    "connector": "bg-primary-600 dark:bg-primary-400",
    "completedHover":
      "group-hover:bg-primary-800 dark:group-hover:bg-primary-400",
    "completed":
      "border-transparent bg-primary-600 text-white dark:bg-primary-500",
    "indicator":
      "border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400",
  },
  "success": {
    "label": "text-success-600 dark:text-success-400",
    "connector": "bg-success-600 dark:bg-success-400",
    "completedHover":
      "group-hover:bg-success-800 dark:group-hover:bg-success-400",
    "completed":
      "border-transparent bg-success-600 text-white dark:bg-success-500",
    "indicator":
      "border-success-600 text-success-600 dark:border-success-400 dark:text-success-400",
  },
  "warning": {
    "label": "text-warning-600 dark:text-warning-400",
    "connector": "bg-warning-600 dark:bg-warning-400",
    "completedHover":
      "group-hover:bg-warning-800 dark:group-hover:bg-warning-400",
    "completed":
      "border-transparent bg-warning-600 text-white dark:bg-warning-500",
    "indicator":
      "border-warning-600 text-warning-600 dark:border-warning-400 dark:text-warning-400",
  },
  "secondary": {
    "label": "text-secondary-600 dark:text-secondary-400",
    "connector": "bg-secondary-600 dark:bg-secondary-400",
    "completedHover":
      "group-hover:bg-secondary-800 dark:group-hover:bg-secondary-400",
    "completed":
      "border-transparent bg-secondary-600 text-white dark:bg-secondary-500",
    "indicator":
      "border-secondary-600 text-secondary-600 dark:border-secondary-400 dark:text-secondary-400",
  },
};
