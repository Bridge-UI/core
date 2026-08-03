export interface OtpFieldInvalidated {
  /**
   * Error message text color.
   */
  "errorMessage": string;

  /**
   * Pin chrome when the field is invalid (outline / filled / stacked / notched).
   */
  "pin": string;

  /**
   * Pin chrome when invalid and `variant` is `underlined`.
   */
  "pinUnderlined": string;
}

export const invalidatedProps: OtpFieldInvalidated = {
  "errorMessage": "text-error-600 dark:text-error-400",
  "pinUnderlined":
    "border-error-500 focus-within:border-error-600 dark:border-error-600 dark:focus-within:border-error-600",
  "pin":
    "bg-error-50 ring-error-500 focus-within:ring-error-600 dark:bg-error-700/10 dark:ring-error-600 dark:focus-within:ring-error-600",
};
