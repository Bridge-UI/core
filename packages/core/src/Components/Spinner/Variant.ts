export interface SpinnerVariant {
  /**
   * Determinate variant — arc length follows `value`.
   */
  "determinate": string;

  /**
   * Indeterminate variant — rotating spinner for unknown duration.
   */
  "indeterminate": string;
}

export const variantProps: SpinnerVariant = {
  "determinate": "",
  "indeterminate": "animate-bridge-spinner-rotate",
};
