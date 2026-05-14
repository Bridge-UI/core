// prettier-ignore
export interface ToggleColorItem {
  "track": string;
  "trackChecked": string;
  "thumb": string;
  "focus": string;
}

// prettier-ignore
export interface ToggleColor {
  "dark": ToggleColorItem;
  "primary": ToggleColorItem;
  "secondary": ToggleColorItem;
  "success": ToggleColorItem;
  "error": ToggleColorItem;
  "warning": ToggleColorItem;
  "info": ToggleColorItem;
}

// prettier-ignore
export const colorProps: ToggleColor = {
  "dark": {
    "track": "bg-gray-200 dark:bg-gray-700",
    "trackChecked": "bg-dark-600",
    "thumb": "bg-white",
    "focus": "ring-dark-500/30",
  },
  "primary": {
    "track": "bg-gray-200 dark:bg-gray-700",
    "trackChecked": "bg-primary-600",
    "thumb": "bg-white",
    "focus": "ring-primary-500/30",
  },
  "secondary": {
    "track": "bg-gray-200 dark:bg-gray-700",
    "trackChecked": "bg-secondary-600",
    "thumb": "bg-white",
    "focus": "ring-secondary-500/30",
  },
  "success": {
    "track": "bg-gray-200 dark:bg-gray-700",
    "trackChecked": "bg-success-600",
    "thumb": "bg-white",
    "focus": "ring-success-500/30",
  },
  "error": {
    "track": "bg-gray-200 dark:bg-gray-700",
    "trackChecked": "bg-error-600",
    "thumb": "bg-white",
    "focus": "ring-error-500/30",
  },
  "warning": {
    "track": "bg-gray-200 dark:bg-gray-700",
    "trackChecked": "bg-warning-600",
    "thumb": "bg-white",
    "focus": "ring-warning-500/30",
  },
  "info": {
    "track": "bg-gray-200 dark:bg-gray-700",
    "trackChecked": "bg-info-600",
    "thumb": "bg-white",
    "focus": "ring-info-500/30",
  },
};
