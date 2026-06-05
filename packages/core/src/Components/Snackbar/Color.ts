// prettier-ignore
export interface SnackbarColorItem {
  "icon"?: unknown;
  "iconColor": string;
}

// prettier-ignore
export interface SnackbarColor {
  "dark": SnackbarColorItem;
  "primary": SnackbarColorItem;
  "secondary": SnackbarColorItem;
  "success": SnackbarColorItem;
  "error": SnackbarColorItem;
  "warning": SnackbarColorItem;
  "info": SnackbarColorItem;
}

// prettier-ignore
export const colorProps: SnackbarColor = {
  "dark": {
    "iconColor": "text-dark-800 dark:text-dark-200",
  },
  "primary": {
    "iconColor": "text-primary-800 dark:text-primary-200",
  },
  "secondary": {
    "iconColor": "text-secondary-800 dark:text-secondary-200",
  },
  "success": {
    "iconColor": "text-success-800 dark:text-success-200",
  },
  "error": {
    "iconColor": "text-error-800 dark:text-error-200",
  },
  "warning": {
    "iconColor": "text-warning-800 dark:text-warning-200",
  },
  "info": {
    "iconColor": "text-info-800 dark:text-info-200",
  },
};
