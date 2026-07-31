export interface FormControlInvalidated {
  /**
   * Error message text color.
   */
  "errorMessage": string;
}

export const invalidatedProps: FormControlInvalidated = {
  "errorMessage": "text-error-600 dark:text-error-400",
};
