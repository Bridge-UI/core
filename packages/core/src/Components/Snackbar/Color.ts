export interface SnackbarColorItem {
  "icon"?: unknown;
  "iconColor": string;
  "progressColor": string;
  "titleColor": string;
}

export interface SnackbarColor {
  "dark": SnackbarColorItem;
  "error": SnackbarColorItem;
  "info": SnackbarColorItem;
  "primary": SnackbarColorItem;
  "secondary": SnackbarColorItem;
  "success": SnackbarColorItem;
  "warning": SnackbarColorItem;
}

export const colorProps: SnackbarColor = {
  "dark": {
    "iconColor": "text-dark-800 dark:text-dark-200",
    "progressColor": "bg-dark-500 dark:bg-dark-400",
    "titleColor": "text-dark-800 dark:text-dark-200",
  },
  "info": {
    "iconColor": "text-info-800 dark:text-info-200",
    "progressColor": "bg-info-500 dark:bg-info-400",
    "titleColor": "text-info-800 dark:text-info-200",
  },
  "error": {
    "iconColor": "text-error-800 dark:text-error-200",
    "progressColor": "bg-error-500 dark:bg-error-400",
    "titleColor": "text-error-800 dark:text-error-200",
  },
  "primary": {
    "iconColor": "text-primary-800 dark:text-primary-200",
    "progressColor": "bg-primary-500 dark:bg-primary-400",
    "titleColor": "text-primary-800 dark:text-primary-200",
  },
  "success": {
    "iconColor": "text-success-800 dark:text-success-200",
    "progressColor": "bg-success-500 dark:bg-success-400",
    "titleColor": "text-success-800 dark:text-success-200",
  },
  "warning": {
    "iconColor": "text-warning-800 dark:text-warning-200",
    "progressColor": "bg-warning-500 dark:bg-warning-400",
    "titleColor": "text-warning-800 dark:text-warning-200",
  },
  "secondary": {
    "iconColor": "text-secondary-800 dark:text-secondary-200",
    "progressColor": "bg-secondary-500 dark:bg-secondary-400",
    "titleColor": "text-secondary-800 dark:text-secondary-200",
  },
};
