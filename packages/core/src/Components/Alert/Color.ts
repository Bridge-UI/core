// prettier-ignore
export interface AlertColorItem {
  "icon": string;
  "text": string;
  "border"?: string;
  "iconColor": string;
  "background": string;
}

// prettier-ignore
export interface AlertColor {
  "dark": AlertColorItem;
  "primary": AlertColorItem;
  "secondary": AlertColorItem;
  "success": AlertColorItem;
  "error": AlertColorItem;
  "warning": AlertColorItem;
  "info": AlertColorItem;
}

// prettier-ignore
export const flatProps: AlertColor = {
  "dark": {
    "icon": "information-circle",
    "iconColor": "text-dark-800 dark:text-dark-200",
    "text": "text-dark-800 dark:text-dark-200",
    "background": "bg-dark-50 dark:bg-dark-900/70",
  },
  "primary": {
    "icon": "bell",
    "iconColor": "text-primary-800 dark:text-primary-200",
    "text": "text-primary-800 dark:text-primary-200",
    "background": "bg-primary-50 dark:bg-primary-900/70",
  },
  "secondary": {
    "icon": "information-circle",
    "iconColor": "text-secondary-800 dark:text-secondary-200",
    "text": "text-secondary-800 dark:text-secondary-200",
    "background": "bg-secondary-50 dark:bg-secondary-900/70",
  },
  "success": {
    "icon": "check-circle",
    "iconColor": "text-success-800 dark:text-success-200",
    "text": "text-success-800 dark:text-success-200",
    "background": "bg-success-50 dark:bg-success-900/70",
  },
  "error": {
    "icon": "x-circle",
    "iconColor": "text-error-800 dark:text-error-200",
    "text": "text-error-800 dark:text-error-200",
    "background": "bg-error-50 dark:bg-error-900/70",
  },
  "warning": {
    "icon": "exclamation-triangle",
    "iconColor": "text-warning-800 dark:text-warning-200",
    "text": "text-warning-800 dark:text-warning-200",
    "background": "bg-warning-50 dark:bg-warning-900/70",
  },
  "info": {
    "icon": "information-circle",
    "iconColor": "text-info-800 dark:text-info-200",
    "text": "text-info-800 dark:text-info-200",
    "background": "bg-info-50 dark:bg-info-900/70",
  },
};

// prettier-ignore
export const solidProps: AlertColor = {
  "dark": {
    "icon": "information-circle",
    "iconColor": "text-white dark:text-black",
    "text": "text-white dark:text-black",
    "background": "bg-dark-600 dark:bg-dark-600",
  },
  "primary": {
    "icon": "bell",
    "iconColor": "text-white dark:text-black",
    "text": "text-white dark:text-black",
    "background": "bg-primary-600 dark:bg-primary-600",
  },
  "secondary": {
    "icon": "information-circle",
    "iconColor": "text-white dark:text-black",
    "text": "text-white dark:text-black",
    "background": "bg-secondary-600 dark:bg-secondary-600",
  },
  "success": {
    "icon": "check-circle",
    "iconColor": "text-white dark:text-black",
    "text": "text-white dark:text-black",
    "background": "bg-success-600 dark:bg-success-600",
  },
  "error": {
    "icon": "x-circle",
    "iconColor": "text-white dark:text-black",
    "text": "text-white dark:text-black",
    "background": "bg-error-600 dark:bg-error-600",
  },
  "warning": {
    "icon": "exclamation-triangle",
    "iconColor": "text-white dark:text-black",
    "text": "text-white dark:text-black",
    "background": "bg-warning-600 dark:bg-warning-600",
  },
  "info": {
    "icon": "information-circle",
    "iconColor": "text-white dark:text-black",
    "text": "text-white dark:text-black",
    "background": "bg-info-600 dark:bg-info-600",
  },
};

// prettier-ignore
export const outlineProps: AlertColor = {
  "dark": {
    "icon": "information-circle",
    "iconColor": "text-dark-800 dark:text-dark-600",
    "text": "text-dark-800 dark:text-dark-600",
    "border": "border border-dark-600",
    "background": "bg-transparent",
  },
  "primary": {
    "icon": "bell",
    "iconColor": "text-primary-800 dark:text-primary-600",
    "text": "text-primary-800 dark:text-primary-600",
    "border": "border border-primary-600",
    "background": "bg-transparent",
  },
  "secondary": {
    "icon": "information-circle",
    "iconColor": "text-secondary-800 dark:text-secondary-600",
    "text": "text-secondary-800 dark:text-secondary-600",
    "border": "border border-secondary-600",
    "background": "bg-transparent",
  },
  "success": {
    "icon": "check-circle",
    "iconColor": "text-success-800 dark:text-success-600",
    "text": "text-success-800 dark:text-success-600",
    "border": "border border-success-600",
    "background": "bg-transparent",
  },
  "error": {
    "icon": "x-circle",
    "iconColor": "text-error-800 dark:text-error-600",
    "text": "text-error-800 dark:text-error-600",
    "border": "border border-error-600",
    "background": "bg-transparent",
  },
  "warning": {
    "icon": "exclamation-triangle",
    "iconColor": "text-warning-800 dark:text-warning-600",
    "text": "text-warning-800 dark:text-warning-600",
    "border": "border border-warning-600",
    "background": "bg-transparent",
  },
  "info": {
    "icon": "information-circle",
    "iconColor": "text-info-800 dark:text-info-600",
    "text": "text-info-800 dark:text-info-600",
    "border": "border border-info-600",
    "background": "bg-transparent",
  },
};
