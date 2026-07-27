export interface ProgressVariant {
  /**
   * Buffer variant — determinate bar plus a secondary buffer bar.
   */
  "buffer": string;

  /**
   * Determinate variant — bar width follows `value`.
   */
  "determinate": string;

  /**
   * Indeterminate variant — animated bar for unknown duration.
   */
  "indeterminate": string;

  /**
   * Query variant — reverse indeterminate animation.
   */
  "query": string;
}

export const variantProps: ProgressVariant = {
  "buffer": "",
  "determinate": "",
  "query": "w-1/3 animate-bridge-progress-query",
  "indeterminate": "w-1/3 animate-bridge-progress-indeterminate",
};
