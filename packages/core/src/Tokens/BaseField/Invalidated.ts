export interface BaseFieldInvalidated {
  /**
   * Error message text color.
   */
  "errorMessage": string;
}

export const invalidatedProps: BaseFieldInvalidated = {
  "errorMessage": "text-error-600 dark:text-error-400",
};
