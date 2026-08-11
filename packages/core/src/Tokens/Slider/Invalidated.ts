export interface SliderInvalidated {
  /**
   * Filled bar classes when invalid.
   */
  "bar": string;

  /**
   * Focus ring classes when invalid.
   */
  "focus": string;

  /**
   * Stop label classes when invalid.
   */
  "stopLabel": string;

  /**
   * Thumb knob classes when invalid.
   */
  "thumb": string;

  /**
   * Track classes when invalid.
   */
  "track": string;
}

export const invalidatedProps: SliderInvalidated = {
  "focus": "ring-error-500/30",
  "bar": "bg-error-600 dark:bg-error-400",
  "track": "bg-dark-200 dark:bg-dark-700",
  "stopLabel": "text-error-600 dark:text-error-400",
  "thumb": "border-error-600 dark:border-error-400 bg-white",
};
