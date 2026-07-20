export interface FormFieldColorItem {
  /**
   * End adornment color classes.
   */
  "end": string;

  /**
   * Input text color classes.
   */
  "input": string;

  /**
   * Loading progress bar color classes.
   */
  "progressColor": string;

  /**
   * Start adornment color classes.
   */
  "start": string;

  /**
   * Underlined variant color classes.
   */
  "underlined"?: string;
}

export interface FormFieldColor {
  /**
   * `dark` semantic color palette.
   */
  "dark": FormFieldColorItem;

  /**
   * `error` semantic color palette.
   */
  "error": FormFieldColorItem;

  /**
   * Info semantic color palette.
   */
  "info": FormFieldColorItem;

  /**
   * `primary` semantic color palette.
   */
  "primary": FormFieldColorItem;

  /**
   * `secondary` semantic color palette.
   */
  "secondary": FormFieldColorItem;

  /**
   * `success` semantic color palette.
   */
  "success": FormFieldColorItem;

  /**
   * `warning` semantic color palette.
   */
  "warning": FormFieldColorItem;
}

export const colorProps: FormFieldColor = {
  "dark": {
    "input": "focus-within:ring-dark-600",
    "end": "group-focus-within:text-dark-500",
    "start": "group-focus-within:text-dark-500",
    "underlined": "focus-within:border-dark-600",
    "progressColor": "bg-dark-500 dark:bg-dark-400",
  },
  "info": {
    "input": "focus-within:ring-info-600",
    "end": "group-focus-within:text-info-500",
    "start": "group-focus-within:text-info-500",
    "underlined": "focus-within:border-info-600",
    "progressColor": "bg-info-500 dark:bg-info-400",
  },
  "error": {
    "input": "focus-within:ring-error-600",
    "end": "group-focus-within:text-error-500",
    "start": "group-focus-within:text-error-500",
    "underlined": "focus-within:border-error-600",
    "progressColor": "bg-error-500 dark:bg-error-400",
  },
  "primary": {
    "input": "focus-within:ring-primary-600",
    "end": "group-focus-within:text-primary-500",
    "start": "group-focus-within:text-primary-500",
    "underlined": "focus-within:border-primary-600",
    "progressColor": "bg-primary-500 dark:bg-primary-400",
  },
  "success": {
    "input": "focus-within:ring-success-600",
    "end": "group-focus-within:text-success-500",
    "start": "group-focus-within:text-success-500",
    "underlined": "focus-within:border-success-600",
    "progressColor": "bg-success-500 dark:bg-success-400",
  },
  "warning": {
    "input": "focus-within:ring-warning-600",
    "end": "group-focus-within:text-warning-500",
    "start": "group-focus-within:text-warning-500",
    "underlined": "focus-within:border-warning-600",
    "progressColor": "bg-warning-500 dark:bg-warning-400",
  },
  "secondary": {
    "input": "focus-within:ring-secondary-600",
    "end": "group-focus-within:text-secondary-500",
    "start": "group-focus-within:text-secondary-500",
    "underlined": "focus-within:border-secondary-600",
    "progressColor": "bg-secondary-500 dark:bg-secondary-400",
  },
};
