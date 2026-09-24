export interface FileUploadColorItem {
  /**
   * Classes applied to the dropzone while a file is dragged over it.
   */
  "dragging": string;
}

export interface FileUploadColor {
  /**
   * `black` high-contrast palette (black / white only).
   */
  "black": FileUploadColorItem;

  /**
   * `dark` semantic color palette.
   */
  "dark": FileUploadColorItem;

  /**
   * `error` semantic color palette.
   */
  "error": FileUploadColorItem;

  /**
   * Info semantic color palette.
   */
  "info": FileUploadColorItem;

  /**
   * `primary` semantic color palette.
   */
  "primary": FileUploadColorItem;

  /**
   * `secondary` semantic color palette.
   */
  "secondary": FileUploadColorItem;

  /**
   * `success` semantic color palette.
   */
  "success": FileUploadColorItem;

  /**
   * `warning` semantic color palette.
   */
  "warning": FileUploadColorItem;
}

export const colorProps: FileUploadColor = {
  "black": {
    "dragging":
      "border-black bg-black/5 text-black dark:border-white dark:bg-white/10 dark:text-white",
  },
  "dark": {
    "dragging":
      "border-dark-500 bg-dark-50 text-dark-700 dark:border-dark-400 dark:bg-dark-950/30 dark:text-dark-200",
  },
  "info": {
    "dragging":
      "border-info-500 bg-info-50 text-info-700 dark:border-info-400 dark:bg-info-950/30 dark:text-info-200",
  },
  "error": {
    "dragging":
      "border-error-500 bg-error-50 text-error-700 dark:border-error-400 dark:bg-error-950/30 dark:text-error-200",
  },
  "primary": {
    "dragging":
      "border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-400 dark:bg-primary-950/30 dark:text-primary-200",
  },
  "success": {
    "dragging":
      "border-success-500 bg-success-50 text-success-700 dark:border-success-400 dark:bg-success-950/30 dark:text-success-200",
  },
  "warning": {
    "dragging":
      "border-warning-500 bg-warning-50 text-warning-700 dark:border-warning-400 dark:bg-warning-950/30 dark:text-warning-200",
  },
  "secondary": {
    "dragging":
      "border-secondary-500 bg-secondary-50 text-secondary-700 dark:border-secondary-400 dark:bg-secondary-950/30 dark:text-secondary-200",
  },
};
