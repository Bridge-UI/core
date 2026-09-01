/**
 * Separator color of the button group hairline.
 */
export interface ButtonGroupColor {
  /**
   * `dark` semantic color palette.
   */
  "dark": string;

  /**
   * `error` semantic color palette.
   */
  "error": string;

  /**
   * `info` semantic color palette.
   */
  "info": string;

  /**
   * `primary` semantic color palette.
   */
  "primary": string;

  /**
   * `secondary` semantic color palette.
   */
  "secondary": string;

  /**
   * `success` semantic color palette.
   */
  "success": string;

  /**
   * `warning` semantic color palette.
   */
  "warning": string;
}

/**
 * Hairline fill classes by semantic color.
 */
export const colorProps: ButtonGroupColor = {
  "dark":
    "[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:bg-dark-200 dark:[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:bg-dark-600",
  "info":
    "[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:bg-info-200 dark:[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:bg-info-700",
  "error":
    "[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:bg-error-200 dark:[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:bg-error-700",
  "primary":
    "[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:bg-primary-200 dark:[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:bg-primary-700",
  "success":
    "[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:bg-success-200 dark:[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:bg-success-700",
  "warning":
    "[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:bg-warning-200 dark:[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:bg-warning-700",
  "secondary":
    "[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:bg-secondary-200 dark:[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:bg-secondary-700",
};
