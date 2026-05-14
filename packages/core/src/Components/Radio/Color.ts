// prettier-ignore
export interface RadioColorItem {
  "base": string;
  "checked": string;
  "focus": string;
}

// prettier-ignore
export interface RadioColor {
  "dark": RadioColorItem;
  "primary": RadioColorItem;
  "secondary": RadioColorItem;
  "success": RadioColorItem;
  "error": RadioColorItem;
  "warning": RadioColorItem;
  "info": RadioColorItem;
}

// prettier-ignore
export const colorProps: RadioColor = {
  "dark": {
    "base": "border-gray-300 dark:border-gray-600",
    "checked": "bg-dark-600 border-dark-600",
    "focus": "ring-dark-500/30",
  },
  "primary": {
    "base": "border-gray-300 dark:border-gray-600",
    "checked": "bg-primary-600 border-primary-600",
    "focus": "ring-primary-500/30",
  },
  "secondary": {
    "base": "border-gray-300 dark:border-gray-600",
    "checked": "bg-secondary-600 border-secondary-600",
    "focus": "ring-secondary-500/30",
  },
  "success": {
    "base": "border-gray-300 dark:border-gray-600",
    "checked": "bg-success-600 border-success-600",
    "focus": "ring-success-500/30",
  },
  "error": {
    "base": "border-gray-300 dark:border-gray-600",
    "checked": "bg-error-600 border-error-600",
    "focus": "ring-error-500/30",
  },
  "warning": {
    "base": "border-gray-300 dark:border-gray-600",
    "checked": "bg-warning-600 border-warning-600",
    "focus": "ring-warning-500/30",
  },
  "info": {
    "base": "border-gray-300 dark:border-gray-600",
    "checked": "bg-info-600 border-info-600",
    "focus": "ring-info-500/30",
  },
};
