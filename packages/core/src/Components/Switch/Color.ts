export interface SwitchColorItem {
  "focus": string;
  "thumb": string;
  "track": string;
  "trackChecked": string;
}

export interface SwitchColor {
  "dark": SwitchColorItem;
  "error": SwitchColorItem;
  "info": SwitchColorItem;
  "primary": SwitchColorItem;
  "secondary": SwitchColorItem;
  "success": SwitchColorItem;
  "warning": SwitchColorItem;
}

export const colorProps: SwitchColor = {
  "dark": {
    "thumb": "bg-white",
    "focus": "ring-dark-500/30",
    "trackChecked": "bg-dark-600",
    "track": "bg-gray-200 dark:bg-gray-700",
  },
  "info": {
    "thumb": "bg-white",
    "focus": "ring-info-500/30",
    "trackChecked": "bg-info-600",
    "track": "bg-gray-200 dark:bg-gray-700",
  },
  "error": {
    "thumb": "bg-white",
    "focus": "ring-error-500/30",
    "trackChecked": "bg-error-600",
    "track": "bg-gray-200 dark:bg-gray-700",
  },
  "primary": {
    "thumb": "bg-white",
    "focus": "ring-primary-500/30",
    "trackChecked": "bg-primary-600",
    "track": "bg-gray-200 dark:bg-gray-700",
  },
  "success": {
    "thumb": "bg-white",
    "focus": "ring-success-500/30",
    "trackChecked": "bg-success-600",
    "track": "bg-gray-200 dark:bg-gray-700",
  },
  "warning": {
    "thumb": "bg-white",
    "focus": "ring-warning-500/30",
    "trackChecked": "bg-warning-600",
    "track": "bg-gray-200 dark:bg-gray-700",
  },
  "secondary": {
    "thumb": "bg-white",
    "focus": "ring-secondary-500/30",
    "trackChecked": "bg-secondary-600",
    "track": "bg-gray-200 dark:bg-gray-700",
  },
};
