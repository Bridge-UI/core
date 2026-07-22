export interface DividerColor {
  /**
   * `dark` semantic fill color.
   */
  "dark": string;

  /**
   * `error` semantic fill color.
   */
  "error": string;

  /**
   * `info` semantic fill color.
   */
  "info": string;

  /**
   * `primary` semantic fill color.
   */
  "primary": string;

  /**
   * `secondary` semantic fill color.
   */
  "secondary": string;

  /**
   * `success` semantic fill color.
   */
  "success": string;

  /**
   * `warning` semantic fill color.
   */
  "warning": string;
}

/**
 * Divider colors use background utilities (not `border-*`) so host resets like
 * `* { border-color: … }` cannot wash out semantic colors.
 */
export const colorProps: DividerColor = {
  "dark": "bg-dark-200 dark:bg-dark-600",
  "info": "bg-info-200 dark:bg-info-700",
  "error": "bg-error-200 dark:bg-error-700",
  "primary": "bg-primary-200 dark:bg-primary-700",
  "success": "bg-success-200 dark:bg-success-700",
  "warning": "bg-warning-200 dark:bg-warning-700",
  "secondary": "bg-secondary-200 dark:bg-secondary-700",
};
