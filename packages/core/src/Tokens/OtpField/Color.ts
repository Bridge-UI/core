export interface OtpFieldColorItem {
  /**
   * Focus ring / underline color on each pin when focused.
   */
  "pin": string;

  /**
   * Underlined variant focus border color.
   */
  "underlined"?: string;
}

export interface OtpFieldColor {
  /**
   * `black` semantic color palette.
   */
  "black": OtpFieldColorItem;

  /**
   * `dark` semantic color palette.
   */
  "dark": OtpFieldColorItem;

  /**
   * `error` semantic color palette.
   */
  "error": OtpFieldColorItem;

  /**
   * `info` semantic color palette.
   */
  "info": OtpFieldColorItem;

  /**
   * `primary` semantic color palette.
   */
  "primary": OtpFieldColorItem;

  /**
   * `secondary` semantic color palette.
   */
  "secondary": OtpFieldColorItem;

  /**
   * `success` semantic color palette.
   */
  "success": OtpFieldColorItem;

  /**
   * `warning` semantic color palette.
   */
  "warning": OtpFieldColorItem;
}

export const colorProps: OtpFieldColor = {
  "info": {
    "pin": "focus-within:ring-info-600",
    "underlined": "focus-within:border-info-600",
  },
  "error": {
    "pin": "focus-within:ring-error-600",
    "underlined": "focus-within:border-error-600",
  },
  "primary": {
    "pin": "focus-within:ring-primary-600",
    "underlined": "focus-within:border-primary-600",
  },
  "success": {
    "pin": "focus-within:ring-success-600",
    "underlined": "focus-within:border-success-600",
  },
  "warning": {
    "pin": "focus-within:ring-warning-600",
    "underlined": "focus-within:border-warning-600",
  },
  "secondary": {
    "pin": "focus-within:ring-secondary-600",
    "underlined": "focus-within:border-secondary-600",
  },
  "black": {
    "pin": "focus-within:ring-black dark:focus-within:ring-white",
    "underlined": "focus-within:border-black dark:focus-within:border-white",
  },
  "dark": {
    "pin": "focus-within:ring-dark-600 dark:focus-within:ring-dark-400",
    "underlined":
      "focus-within:border-dark-600 dark:focus-within:border-dark-400",
  },
};
