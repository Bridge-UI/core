export interface FormControlInvalidated {
  /**
   * Error message text color.
   */
  "errorMessage": string;

  /**
   * Label text color (`startLabel`, `mainLabel`, `endLabel`).
   */
  "label": string;

  /**
   * Required asterisk color.
   */
  "required": string;
}

export const invalidatedProps: FormControlInvalidated = {
  "label": "text-error-600 dark:text-error-400",
  "errorMessage": "text-error-600 dark:text-error-400",
  "required": "text-error-500 dark:text-error-500 select-none",
};
