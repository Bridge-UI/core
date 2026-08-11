export interface RadioInvalidated {
  /**
   * Base color when invalid.
   */
  "base": string;

  /**
   * Checked color when invalid.
   */
  "checked": string;

  /**
   * Focus color when invalid.
   */
  "focus": string;
}

export const invalidatedProps: RadioInvalidated = {
  "focus": "ring-error-500/30",
  "checked": "bg-error-600 border-error-600",
  "base": "border-dark-300 dark:border-dark-600",
};
