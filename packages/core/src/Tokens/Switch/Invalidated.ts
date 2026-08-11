export interface SwitchInvalidated {
  /**
   * Focus color when invalid.
   */
  "focus": string;

  /**
   * Thumb color when invalid.
   */
  "thumb": string;

  /**
   * Track color when invalid.
   */
  "track": string;

  /**
   * Track checked color when invalid.
   */
  "trackChecked": string;
}

export const invalidatedProps: SwitchInvalidated = {
  "thumb": "bg-white",
  "focus": "ring-error-500/30",
  "trackChecked": "bg-error-600",
  "track": "bg-dark-200 dark:bg-dark-700",
};
