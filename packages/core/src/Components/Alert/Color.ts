export interface AlertColorItem {
  icon: string;
  text: string;
  border?: string;
  iconColor: string;
  background: string;
}

export interface AlertColor {
  primary: AlertColorItem;
  secondary: AlertColorItem;
  positive: AlertColorItem;
  negative: AlertColorItem;
  warning: AlertColorItem;
  info: AlertColorItem;
}

export const flatProps: AlertColor = {
  primary: {
    icon: "bell",
    iconColor: "text-primary-800 dark:text-primary-200",
    text: "text-primary-800 dark:text-primary-200",
    background: "bg-primary-50 dark:bg-primary-900/70",
  },
  secondary: {
    icon: "information-circle",
    iconColor: "text-secondary-800 dark:text-secondary-200",
    text: "text-secondary-800 dark:text-secondary-200",
    background: "bg-secondary-50 dark:bg-secondary-900/70",
  },
  positive: {
    icon: "check-circle",
    iconColor: "text-positive-800 dark:text-positive-200",
    text: "text-positive-800 dark:text-positive-200",
    background: "bg-positive-50 dark:bg-positive-900/70",
  },
  negative: {
    icon: "x-circle",
    iconColor: "text-negative-800 dark:text-negative-200",
    text: "text-negative-800 dark:text-negative-200",
    background: "bg-negative-50 dark:bg-negative-900/70",
  },
  warning: {
    icon: "exclamation-triangle",
    iconColor: "text-warning-800 dark:text-warning-200",
    text: "text-warning-800 dark:text-warning-200",
    background: "bg-warning-50 dark:bg-warning-900/70",
  },
  info: {
    icon: "information-circle",
    iconColor: "text-info-800 dark:text-info-200",
    text: "text-info-800 dark:text-info-200",
    background: "bg-info-50 dark:bg-info-900/70",
  },
};

export const solidProps: AlertColor = {
  primary: {
    icon: "bell",
    iconColor: "text-white dark:text-black",
    text: "text-white dark:text-black",
    background: "bg-primary-600 dark:bg-primary-600",
  },
  secondary: {
    icon: "information-circle",
    iconColor: "text-white dark:text-black",
    text: "text-white dark:text-black",
    background: "bg-secondary-600 dark:bg-secondary-600",
  },
  positive: {
    icon: "check-circle",
    iconColor: "text-white dark:text-black",
    text: "text-white dark:text-black",
    background: "bg-positive-600 dark:bg-positive-600",
  },
  negative: {
    icon: "x-circle",
    iconColor: "text-white dark:text-black",
    text: "text-white dark:text-black",
    background: "bg-negative-600 dark:bg-negative-600",
  },
  warning: {
    icon: "exclamation-triangle",
    iconColor: "text-white dark:text-black",
    text: "text-white dark:text-black",
    background: "bg-warning-600 dark:bg-warning-600",
  },
  info: {
    icon: "information-circle",
    iconColor: "text-white dark:text-black",
    text: "text-white dark:text-black",
    background: "bg-info-600 dark:bg-info-600",
  },
};

export const outlineProps: AlertColor = {
  primary: {
    icon: "bell",
    iconColor: "text-primary-800 dark:text-primary-600",
    text: "text-primary-800 dark:text-primary-600",
    border: "border border-primary-600",
    background: "bg-transparent",
  },
  secondary: {
    icon: "information-circle",
    iconColor: "text-secondary-800 dark:text-secondary-600",
    text: "text-secondary-800 dark:text-secondary-600",
    border: "border border-secondary-600",
    background: "bg-transparent",
  },
  positive: {
    icon: "check-circle",
    iconColor: "text-positive-800 dark:text-positive-600",
    text: "text-positive-800 dark:text-positive-600",
    border: "border border-positive-600",
    background: "bg-transparent",
  },
  negative: {
    icon: "x-circle",
    iconColor: "text-negative-800 dark:text-negative-600",
    text: "text-negative-800 dark:text-negative-600",
    border: "border border-negative-600",
    background: "bg-transparent",
  },
  warning: {
    icon: "exclamation-triangle",
    iconColor: "text-warning-800 dark:text-warning-600",
    text: "text-warning-800 dark:text-warning-600",
    border: "border border-warning-600",
    background: "bg-transparent",
  },
  info: {
    icon: "information-circle",
    iconColor: "text-info-800 dark:text-info-600",
    text: "text-info-800 dark:text-info-600",
    border: "border border-info-600",
    background: "bg-transparent",
  },
};
