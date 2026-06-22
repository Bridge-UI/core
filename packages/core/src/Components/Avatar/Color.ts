export interface AvatarColorItem {
  /**
   * Avatar background color classes.
   */
  "background": string;

  /**
   * Fallback text color classes.
   */
  "text": string;
}

export interface AvatarColor {
  /**
   * `dark` semantic color palette.
   */
  "dark": AvatarColorItem;

  /**
   * `error` semantic color palette.
   */
  "error": AvatarColorItem;

  /**
   * Info semantic color palette.
   */
  "info": AvatarColorItem;

  /**
   * `primary` semantic color palette.
   */
  "primary": AvatarColorItem;

  /**
   * `secondary` semantic color palette.
   */
  "secondary": AvatarColorItem;

  /**
   * `success` semantic color palette.
   */
  "success": AvatarColorItem;

  /**
   * `warning` semantic color palette.
   */
  "warning": AvatarColorItem;
}

export const colorProps: AvatarColor = {
  "dark": {
    "text": "text-dark-800 dark:text-dark-200",
    "background": "bg-dark-100 dark:bg-dark-800",
  },
  "info": {
    "text": "text-info-800 dark:text-info-200",
    "background": "bg-info-100 dark:bg-info-800",
  },
  "error": {
    "text": "text-error-800 dark:text-error-200",
    "background": "bg-error-100 dark:bg-error-800",
  },
  "primary": {
    "text": "text-primary-800 dark:text-primary-200",
    "background": "bg-primary-100 dark:bg-primary-800",
  },
  "success": {
    "text": "text-success-800 dark:text-success-200",
    "background": "bg-success-100 dark:bg-success-800",
  },
  "warning": {
    "text": "text-warning-800 dark:text-warning-200",
    "background": "bg-warning-100 dark:bg-warning-800",
  },
  "secondary": {
    "text": "text-secondary-800 dark:text-secondary-200",
    "background": "bg-secondary-100 dark:bg-secondary-800",
  },
};
