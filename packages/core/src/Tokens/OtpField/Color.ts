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
  "dark": OtpFieldColorItem;
  "error": OtpFieldColorItem;
  "info": OtpFieldColorItem;
  "primary": OtpFieldColorItem;
  "secondary": OtpFieldColorItem;
  "success": OtpFieldColorItem;
  "warning": OtpFieldColorItem;
}

export const colorProps: OtpFieldColor = {
  "dark": {
    "pin": "focus-within:ring-dark-600",
    "underlined": "focus-within:border-dark-600",
  },
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
};
