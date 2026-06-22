export interface FormFieldInvalidated {
  /**
   * Inline adornment color (start/end slots and icons).
   */
  "adornment": string;

  /**
   * Outline/filled container chrome when invalid.
   */
  "container": string;

  /**
   * Underlined container chrome when invalid.
   */
  "containerUnderlined": string;

  /**
   * End adornment text color.
   */
  "end": string;

  /**
   * Error message text color.
   */
  "errorMessage": string;

  /**
   * Input text color.
   */
  "input": string;

  /**
   * Label text color (`startLabel`, `mainLabel`, `endLabel`).
   */
  "label": string;

  /**
   * Required asterisk color.
   */
  "required": string;

  /**
   * Start adornment text color.
   */
  "start": string;

  /**
   * Underlined container chrome when invalid.
   */
  "underlined"?: string;
}

export const invalidatedProps: FormFieldInvalidated = {
  "adornment": "text-error-500",
  "input": "focus-within:ring-error-600",
  "end": "group-focus-within:text-error-500",
  "start": "group-focus-within:text-error-500",
  "underlined": "focus-within:border-error-600",
  "label": "text-error-600 dark:text-error-400",
  "errorMessage": "text-error-600 dark:text-error-400",
  "required": "text-error-500 dark:text-error-500 select-none",
  "containerUnderlined":
    "border-error-500 focus-within:border-error-600 dark:border-error-600 dark:focus-within:border-error-600",
  "container":
    "bg-error-50 ring-error-500 focus-within:ring-error-600 dark:bg-error-700/10 dark:ring-error-600 dark:focus-within:ring-error-600",
};
