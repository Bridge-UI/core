// prettier-ignore
export interface ToggleColorItem {
  "focus": string;
  "thumb": string;
  "track": string;
  "trackChecked": string;
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
    "thumb": "bg-white",
    "focus": "ring-dark-500/30",
    "trackChecked": "bg-dark-600",
    "track": "bg-gray-200 dark:bg-gray-700",
  },
  "primary": {
    "thumb": "bg-white",
    "focus": "ring-primary-500/30",
    "trackChecked": "bg-primary-600",
    "track": "bg-gray-200 dark:bg-gray-700",
  },
  "secondary": {
    "thumb": "bg-white",
    "focus": "ring-secondary-500/30",
    "trackChecked": "bg-secondary-600",
    "track": "bg-gray-200 dark:bg-gray-700",
  },
  "success": {
    "thumb": "bg-white",
    "focus": "ring-success-500/30",
    "trackChecked": "bg-success-600",
    "track": "bg-gray-200 dark:bg-gray-700",
  },
  "error": {
    "thumb": "bg-white",
    "focus": "ring-error-500/30",
    "trackChecked": "bg-error-600",
    "track": "bg-gray-200 dark:bg-gray-700",
  },
  "warning": {
    "thumb": "bg-white",
    "focus": "ring-warning-500/30",
    "trackChecked": "bg-warning-600",
    "track": "bg-gray-200 dark:bg-gray-700",
  },
  "info": {
    "thumb": "bg-white",
    "focus": "ring-info-500/30",
    "trackChecked": "bg-info-600",
    "track": "bg-gray-200 dark:bg-gray-700",
  },
};
