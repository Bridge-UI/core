export interface BadgeColorItem {
  "background": string;
  "border"?: string;
  "text": string;
}

export interface BadgeColor {
  "dark": BadgeColorItem;
  "error": BadgeColorItem;
  "info": BadgeColorItem;
  "primary": BadgeColorItem;
  "secondary": BadgeColorItem;
  "success": BadgeColorItem;
  "warning": BadgeColorItem;
}

export const flatProps: BadgeColor = {
  "dark": {
    "text": "text-dark-800 dark:text-dark-200",
    "background": "bg-dark-50 dark:bg-dark-900/70",
  },
  "info": {
    "text": "text-info-800 dark:text-info-200",
    "background": "bg-info-50 dark:bg-info-900/70",
  },
  "error": {
    "text": "text-error-800 dark:text-error-200",
    "background": "bg-error-50 dark:bg-error-900/70",
  },
  "primary": {
    "text": "text-primary-800 dark:text-primary-200",
    "background": "bg-primary-50 dark:bg-primary-900/70",
  },
  "success": {
    "text": "text-success-800 dark:text-success-200",
    "background": "bg-success-50 dark:bg-success-900/70",
  },
  "warning": {
    "text": "text-warning-800 dark:text-warning-200",
    "background": "bg-warning-50 dark:bg-warning-900/70",
  },
  "secondary": {
    "text": "text-secondary-800 dark:text-secondary-200",
    "background": "bg-secondary-50 dark:bg-secondary-900/70",
  },
};

export const solidProps: BadgeColor = {
  "dark": {
    "text": "text-white",
    "background": "bg-dark-500",
  },
  "info": {
    "text": "text-white",
    "background": "bg-info-500",
  },
  "error": {
    "text": "text-white",
    "background": "bg-error-500",
  },
  "primary": {
    "text": "text-white",
    "background": "bg-primary-500",
  },
  "success": {
    "text": "text-white",
    "background": "bg-success-500",
  },
  "warning": {
    "text": "text-white",
    "background": "bg-warning-500",
  },
  "secondary": {
    "text": "text-white",
    "background": "bg-secondary-500",
  },
};

export const outlineProps: BadgeColor = {
  "dark": {
    "background": "bg-transparent",
    "text": "text-dark-700 dark:text-dark-300",
    "border": "border border-dark-300 dark:border-dark-600",
  },
  "info": {
    "background": "bg-transparent",
    "text": "text-info-700 dark:text-info-300",
    "border": "border border-info-300 dark:border-info-600",
  },
  "error": {
    "background": "bg-transparent",
    "text": "text-error-700 dark:text-error-300",
    "border": "border border-error-300 dark:border-error-600",
  },
  "primary": {
    "background": "bg-transparent",
    "text": "text-primary-700 dark:text-primary-300",
    "border": "border border-primary-300 dark:border-primary-600",
  },
  "success": {
    "background": "bg-transparent",
    "text": "text-success-700 dark:text-success-300",
    "border": "border border-success-300 dark:border-success-600",
  },
  "warning": {
    "background": "bg-transparent",
    "text": "text-warning-700 dark:text-warning-300",
    "border": "border border-warning-300 dark:border-warning-600",
  },
  "secondary": {
    "background": "bg-transparent",
    "text": "text-secondary-700 dark:text-secondary-300",
    "border": "border border-secondary-300 dark:border-secondary-600",
  },
};
