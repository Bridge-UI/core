export interface DividerColor {
  /**
   * `dark` semantic border color.
   */
  "dark": string;

  /**
   * `error` semantic border color.
   */
  "error": string;

  /**
   * `info` semantic border color.
   */
  "info": string;

  /**
   * `primary` semantic border color.
   */
  "primary": string;

  /**
   * `secondary` semantic border color.
   */
  "secondary": string;

  /**
   * `success` semantic border color.
   */
  "success": string;

  /**
   * `warning` semantic border color.
   */
  "warning": string;
}

export const colorProps: DividerColor = {
  "dark": "border-dark-200 dark:border-dark-600",
  "info": "border-info-200 dark:border-info-700",
  "error": "border-error-200 dark:border-error-700",
  "primary": "border-primary-200 dark:border-primary-700",
  "success": "border-success-200 dark:border-success-700",
  "warning": "border-warning-200 dark:border-warning-700",
  "secondary": "border-secondary-200 dark:border-secondary-700",
};
