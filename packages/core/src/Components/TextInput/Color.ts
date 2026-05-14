// prettier-ignore
export interface TextInputColorItem {
  "base": string;
  "focus": string;
}

// prettier-ignore
export interface TextInputColor {
  "dark": TextInputColorItem;
  "primary": TextInputColorItem;
  "secondary": TextInputColorItem;
  "success": TextInputColorItem;
  "error": TextInputColorItem;
  "warning": TextInputColorItem;
  "info": TextInputColorItem;
}

// prettier-ignore
export const outlineProps: TextInputColor = {
  "dark": {
    "base": "border-gray-300 dark:border-gray-600",
    "focus": "focus:border-dark-500 focus:ring-dark-500/30",
  },
  "primary": {
    "base": "border-gray-300 dark:border-gray-600",
    "focus": "focus:border-primary-500 focus:ring-primary-500/30",
  },
  "secondary": {
    "base": "border-gray-300 dark:border-gray-600",
    "focus": "focus:border-secondary-500 focus:ring-secondary-500/30",
  },
  "success": {
    "base": "border-gray-300 dark:border-gray-600",
    "focus": "focus:border-success-500 focus:ring-success-500/30",
  },
  "error": {
    "base": "border-gray-300 dark:border-gray-600",
    "focus": "focus:border-error-500 focus:ring-error-500/30",
  },
  "warning": {
    "base": "border-gray-300 dark:border-gray-600",
    "focus": "focus:border-warning-500 focus:ring-warning-500/30",
  },
  "info": {
    "base": "border-gray-300 dark:border-gray-600",
    "focus": "focus:border-info-500 focus:ring-info-500/30",
  },
};

// prettier-ignore
export const filledProps: TextInputColor = {
  "dark": {
    "base": "bg-gray-100 dark:bg-gray-800 border-transparent",
    "focus": "focus:bg-white dark:focus:bg-gray-900 focus:ring-dark-500/30",
  },
  "primary": {
    "base": "bg-gray-100 dark:bg-gray-800 border-transparent",
    "focus": "focus:bg-white dark:focus:bg-gray-900 focus:ring-primary-500/30",
  },
  "secondary": {
    "base": "bg-gray-100 dark:bg-gray-800 border-transparent",
    "focus": "focus:bg-white dark:focus:bg-gray-900 focus:ring-secondary-500/30",
  },
  "success": {
    "base": "bg-gray-100 dark:bg-gray-800 border-transparent",
    "focus": "focus:bg-white dark:focus:bg-gray-900 focus:ring-success-500/30",
  },
  "error": {
    "base": "bg-gray-100 dark:bg-gray-800 border-transparent",
    "focus": "focus:bg-white dark:focus:bg-gray-900 focus:ring-error-500/30",
  },
  "warning": {
    "base": "bg-gray-100 dark:bg-gray-800 border-transparent",
    "focus": "focus:bg-white dark:focus:bg-gray-900 focus:ring-warning-500/30",
  },
  "info": {
    "base": "bg-gray-100 dark:bg-gray-800 border-transparent",
    "focus": "focus:bg-white dark:focus:bg-gray-900 focus:ring-info-500/30",
  },
};

// prettier-ignore
export const underlinedProps: TextInputColor = {
  "dark": {
    "base": "border-b border-gray-300 dark:border-gray-600 rounded-none",
    "focus": "focus:border-dark-500",
  },
  "primary": {
    "base": "border-b border-gray-300 dark:border-gray-600 rounded-none",
    "focus": "focus:border-primary-500",
  },
  "secondary": {
    "base": "border-b border-gray-300 dark:border-gray-600 rounded-none",
    "focus": "focus:border-secondary-500",
  },
  "success": {
    "base": "border-b border-gray-300 dark:border-gray-600 rounded-none",
    "focus": "focus:border-success-500",
  },
  "error": {
    "base": "border-b border-gray-300 dark:border-gray-600 rounded-none",
    "focus": "focus:border-error-500",
  },
  "warning": {
    "base": "border-b border-gray-300 dark:border-gray-600 rounded-none",
    "focus": "focus:border-warning-500",
  },
  "info": {
    "base": "border-b border-gray-300 dark:border-gray-600 rounded-none",
    "focus": "focus:border-info-500",
  },
};
