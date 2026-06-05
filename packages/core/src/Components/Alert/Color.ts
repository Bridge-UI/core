// prettier-ignore
export interface AlertColorItem {
  "background": string;
  "border"?: string;
  "icon"?: unknown;
  "iconColor": string;
  "text": string;
}

// prettier-ignore
export interface AlertColor {
  "dark": AlertColorItem;
  "error": AlertColorItem;
  "info": AlertColorItem;
  "primary": AlertColorItem;
  "secondary": AlertColorItem;
  "success": AlertColorItem;
  "warning": AlertColorItem;
}

// prettier-ignore
export const flatProps: AlertColor = {
  "dark": {
    "text": "text-dark-800 dark:text-dark-200",
    "background": "bg-dark-50 dark:bg-dark-900/70",
    "iconColor": "text-dark-800 dark:text-dark-200",
  },
  "info": {
    "text": "text-info-800 dark:text-info-200",
    "background": "bg-info-50 dark:bg-info-900/70",
    "iconColor": "text-info-800 dark:text-info-200",
  },
  "error": {
    "text": "text-error-800 dark:text-error-200",
    "background": "bg-error-50 dark:bg-error-900/70",
    "iconColor": "text-error-800 dark:text-error-200",
  },
  "primary": {
    "text": "text-primary-800 dark:text-primary-200",
    "background": "bg-primary-50 dark:bg-primary-900/70",
    "iconColor": "text-primary-800 dark:text-primary-200",
  },
  "success": {
    "text": "text-success-800 dark:text-success-200",
    "background": "bg-success-50 dark:bg-success-900/70",
    "iconColor": "text-success-800 dark:text-success-200",
  },
  "warning": {
    "text": "text-warning-800 dark:text-warning-200",
    "background": "bg-warning-50 dark:bg-warning-900/70",
    "iconColor": "text-warning-800 dark:text-warning-200",
  },
  "secondary": {
    "text": "text-secondary-800 dark:text-secondary-200",
    "background": "bg-secondary-50 dark:bg-secondary-900/70",
    "iconColor": "text-secondary-800 dark:text-secondary-200",
  },
};

// prettier-ignore
export const solidProps: AlertColor = {
  "dark": {
    "text": "text-white dark:text-black",
    "iconColor": "text-white dark:text-black",
    "background": "bg-dark-600 dark:bg-dark-600",
  },
  "info": {
    "text": "text-white dark:text-black",
    "iconColor": "text-white dark:text-black",
    "background": "bg-info-600 dark:bg-info-600",
  },
  "error": {
    "text": "text-white dark:text-black",
    "iconColor": "text-white dark:text-black",
    "background": "bg-error-600 dark:bg-error-600",
  },
  "primary": {
    "text": "text-white dark:text-black",
    "iconColor": "text-white dark:text-black",
    "background": "bg-primary-600 dark:bg-primary-600",
  },
  "success": {
    "text": "text-white dark:text-black",
    "iconColor": "text-white dark:text-black",
    "background": "bg-success-600 dark:bg-success-600",
  },
  "warning": {
    "text": "text-white dark:text-black",
    "iconColor": "text-white dark:text-black",
    "background": "bg-warning-600 dark:bg-warning-600",
  },
  "secondary": {
    "text": "text-white dark:text-black",
    "iconColor": "text-white dark:text-black",
    "background": "bg-secondary-600 dark:bg-secondary-600",
  },
};

// prettier-ignore
export const outlineProps: AlertColor = {
  "dark": {
    "background": "bg-transparent",
    "border": "border border-dark-600",
    "text": "text-dark-800 dark:text-dark-600",
    "iconColor": "text-dark-800 dark:text-dark-600",
  },
  "info": {
    "background": "bg-transparent",
    "border": "border border-info-600",
    "text": "text-info-800 dark:text-info-600",
    "iconColor": "text-info-800 dark:text-info-600",
  },
  "error": {
    "background": "bg-transparent",
    "border": "border border-error-600",
    "text": "text-error-800 dark:text-error-600",
    "iconColor": "text-error-800 dark:text-error-600",
  },
  "primary": {
    "background": "bg-transparent",
    "border": "border border-primary-600",
    "text": "text-primary-800 dark:text-primary-600",
    "iconColor": "text-primary-800 dark:text-primary-600",
  },
  "success": {
    "background": "bg-transparent",
    "border": "border border-success-600",
    "text": "text-success-800 dark:text-success-600",
    "iconColor": "text-success-800 dark:text-success-600",
  },
  "warning": {
    "background": "bg-transparent",
    "border": "border border-warning-600",
    "text": "text-warning-800 dark:text-warning-600",
    "iconColor": "text-warning-800 dark:text-warning-600",
  },
  "secondary": {
    "background": "bg-transparent",
    "border": "border border-secondary-600",
    "text": "text-secondary-800 dark:text-secondary-600",
    "iconColor": "text-secondary-800 dark:text-secondary-600",
  },
};
