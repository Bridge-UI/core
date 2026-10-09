export interface TextColor {
  /**
   * `black` high-contrast palette (black / white only).
   */
  "black": string;

  /**
   * `dark` semantic color palette.
   */
  "dark": string;

  /**
   * `error` semantic color palette.
   */
  "error": string;

  /**
   * Info semantic color palette.
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

export const defaultProps: TextColor = {
  "black": "text-black dark:text-white",
  "dark": "text-dark-950 dark:text-dark-50",
  "info": "text-info-600 dark:text-info-400",
  "error": "text-error-600 dark:text-error-400",
  "primary": "text-primary-600 dark:text-primary-400",
  "success": "text-success-600 dark:text-success-400",
  "warning": "text-warning-600 dark:text-warning-400",
  "secondary": "text-secondary-600 dark:text-secondary-400",
};

export const mutedProps: TextColor = {
  "dark": "text-dark-500 dark:text-dark-400",
  "black": "text-black/60 dark:text-white/60",
  "info": "text-info-600/75 dark:text-info-400/75",
  "error": "text-error-600/75 dark:text-error-400/75",
  "primary": "text-primary-600/75 dark:text-primary-400/75",
  "success": "text-success-600/75 dark:text-success-400/75",
  "warning": "text-warning-600/75 dark:text-warning-400/75",
  "secondary": "text-secondary-600/75 dark:text-secondary-400/75",
};
