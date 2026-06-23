export interface ButtonColorItem {
  /**
   * Rest state classes.
   */
  "base": string;

  /**
   * Focus ring classes.
   */
  "focus": string;

  /**
   * Hover state classes.
   */
  "hover": string;
}

export interface ButtonColor {
  /**
   * `dark` semantic color palette.
   */
  "dark": ButtonColorItem;

  /**
   * `error` semantic color palette.
   */
  "error": ButtonColorItem;

  /**
   * Info semantic color palette.
   */
  "info": ButtonColorItem;

  /**
   * `primary` semantic color palette.
   */
  "primary": ButtonColorItem;

  /**
   * `secondary` semantic color palette.
   */
  "secondary": ButtonColorItem;

  /**
   * `success` semantic color palette.
   */
  "success": ButtonColorItem;

  /**
   * `warning` semantic color palette.
   */
  "warning": ButtonColorItem;
}

export const flatProps: ButtonColor = {
  "info": {
    "base": "text-info-600",
    "hover":
      "hover:text-info-700 hover:bg-info-400/25 dark:hover:text-info-500 dark:hover:bg-info-600/15",
    "focus":
      "focus:ring-offset-0 focus:text-info-700 focus:bg-info-400/25 focus:ring-info-600 dark:focus:text-info-500 dark:focus:bg-info-600/15 dark:focus:ring-info-700",
  },
  "error": {
    "base": "text-error-600",
    "hover":
      "hover:text-error-700 hover:bg-error-400/25 dark:hover:text-error-500 dark:hover:bg-error-600/15",
    "focus":
      "focus:ring-offset-0 focus:text-error-700 focus:bg-error-400/25 focus:ring-error-600 dark:focus:text-error-500 dark:focus:bg-error-600/15 dark:focus:ring-error-700",
  },
  "dark": {
    "base": "text-dark-600 dark:text-dark-400",
    "hover":
      "hover:text-dark-700 hover:bg-dark-400/25 dark:hover:text-dark-300/90 dark:hover:bg-dark-600/15",
    "focus":
      "focus:ring-offset-0 focus:text-dark-700 focus:bg-dark-400/25 focus:ring-dark-600 dark:focus:text-dark-300/90 dark:focus:bg-dark-400/15 dark:focus:ring-dark-500",
  },
  "primary": {
    "base": "text-primary-600",
    "hover":
      "hover:text-primary-700 hover:bg-primary-400/25 dark:hover:text-primary-500 dark:hover:bg-primary-600/15",
    "focus":
      "focus:ring-offset-0 focus:text-primary-700 focus:bg-primary-400/25 focus:ring-primary-600 dark:focus:text-primary-500 dark:focus:bg-primary-600/15 dark:focus:ring-primary-700",
  },
  "warning": {
    "base": "text-warning-600",
    "hover":
      "hover:text-warning-700 hover:bg-warning-300/25 dark:hover:text-warning-500 dark:hover:bg-warning-600/15",
    "focus":
      "focus:ring-offset-0 focus:text-warning-700 focus:bg-warning-400/25 focus:ring-warning-600 dark:focus:text-warning-500 dark:focus:bg-warning-600/15 dark:focus:ring-warning-700",
  },
  "secondary": {
    "base": "text-secondary-600",
    "hover":
      "hover:text-secondary-700 hover:bg-secondary-400/25 dark:hover:text-secondary-500 dark:hover:bg-secondary-600/15",
    "focus":
      "focus:ring-offset-0 focus:text-secondary-700 focus:bg-secondary-400/25 focus:ring-secondary-600 dark:focus:text-secondary-500 dark:focus:bg-secondary-600/15 dark:focus:ring-secondary-700",
  },
  "success": {
    "base": "text-success-600 dark:text-success-500/90",
    "hover":
      "hover:text-success-700 hover:bg-success-400/25 dark:hover:text-success-500 dark:hover:bg-success-600/15",
    "focus":
      "focus:ring-offset-0 focus:text-success-700 focus:bg-success-400/25 focus:ring-success-600 dark:focus:text-success-500 dark:focus:bg-success-600/15 dark:focus:ring-success-700",
  },
};

export const lightProps: ButtonColor = {
  "dark": {
    "base":
      "text-dark-600 bg-dark-300/60 dark:bg-dark-600/60 dark:text-dark-400",
    "hover":
      "hover:text-dark-800 hover:bg-dark-400/60 dark:hover:text-dark-400 dark:hover:bg-dark-500/30",
    "focus":
      "focus:ring-offset-2 focus:text-dark-800 focus:bg-dark-400/60 focus:ring-dark-400 dark:focus:text-dark-400 dark:focus:bg-dark-500/30 dark:focus:ring-dark-700",
  },
  "info": {
    "base":
      "text-info-600 bg-info-300/60 dark:bg-info-600/60 dark:text-info-400",
    "hover":
      "hover:text-info-800 hover:bg-info-400/60 dark:hover:text-info-400 dark:hover:bg-info-500/30",
    "focus":
      "focus:ring-offset-2 focus:text-info-800 focus:bg-info-400/60 focus:ring-info-400 dark:focus:text-info-400 dark:focus:bg-info-500/30 dark:focus:ring-info-700",
  },
  "error": {
    "base":
      "text-error-600 bg-error-300/60 dark:bg-error-600/60 dark:text-error-500",
    "hover":
      "hover:text-error-800 hover:bg-error-400/60 dark:hover:text-error-400 dark:hover:bg-error-500/30",
    "focus":
      "focus:ring-offset-2 focus:text-error-800 focus:bg-error-400/60 focus:ring-error-400 dark:focus:text-error-400 dark:focus:bg-error-500/30 dark:focus:ring-error-700",
  },
  "primary": {
    "base":
      "text-primary-600 bg-primary-300/60 dark:bg-primary-600/60 dark:text-primary-400",
    "hover":
      "hover:text-primary-800 hover:bg-primary-400/60 dark:hover:text-primary-400 dark:hover:bg-primary-500/30",
    "focus":
      "focus:ring-offset-2 focus:text-primary-800 focus:bg-primary-400/60 focus:ring-primary-400 dark:focus:text-primary-400 dark:focus:bg-primary-500/30 dark:focus:ring-primary-700",
  },
  "success": {
    "base":
      "text-success-600 bg-success-300/60 dark:bg-success-600/60 dark:text-success-500",
    "hover":
      "hover:text-success-800 hover:bg-success-400/60 dark:hover:text-success-400 dark:hover:bg-success-500/30",
    "focus":
      "focus:ring-offset-2 focus:text-success-800 focus:bg-success-400/60 focus:ring-success-400 dark:focus:text-success-400 dark:focus:bg-success-500/30 dark:focus:ring-success-700",
  },
  "warning": {
    "base":
      "text-warning-600 bg-warning-300/60 dark:bg-warning-600/60 dark:text-warning-500",
    "hover":
      "hover:text-warning-800 hover:bg-warning-400/60 dark:hover:text-warning-400 dark:hover:bg-warning-500/30",
    "focus":
      "focus:ring-offset-2 focus:text-warning-800 focus:bg-warning-400/60 focus:ring-warning-400 dark:focus:text-warning-400 dark:focus:bg-warning-500/30 dark:focus:ring-warning-700",
  },
  "secondary": {
    "base":
      "text-secondary-600 bg-secondary-300/60 dark:bg-secondary-600/60 dark:text-secondary-400",
    "hover":
      "hover:text-secondary-800 hover:bg-secondary-400/60 dark:hover:text-secondary-400 dark:hover:bg-secondary-500/30",
    "focus":
      "focus:ring-offset-2 focus:text-secondary-800 focus:bg-secondary-400/60 focus:ring-secondary-400 dark:focus:text-secondary-400 dark:focus:bg-secondary-500/30 dark:focus:ring-secondary-700",
  },
};

export const solidProps: ButtonColor = {
  "dark": {
    "base": "text-white bg-dark-500 dark:bg-dark-700",
    "hover": "hover:text-white hover:bg-dark-600 dark:hover:bg-dark-600",
    "focus":
      "focus:text-white focus:ring-offset-2 focus:bg-dark-600 focus:ring-dark-600 dark:focus:bg-dark-600 dark:focus:ring-dark-600",
  },
  "info": {
    "base": "text-white bg-info-500 dark:bg-info-700",
    "hover": "hover:text-white hover:bg-info-600 dark:hover:bg-info-600",
    "focus":
      "focus:text-white focus:ring-offset-2 focus:bg-info-600 focus:ring-info-600 dark:focus:bg-info-600 dark:focus:ring-info-600",
  },
  "error": {
    "base": "text-white bg-error-500 dark:bg-error-700",
    "hover": "hover:text-white hover:bg-error-600 dark:hover:bg-error-600",
    "focus":
      "focus:text-white focus:ring-offset-2 focus:bg-error-600 focus:ring-error-600 dark:focus:bg-error-600 dark:focus:ring-error-600",
  },
  "primary": {
    "base": "text-white bg-primary-500 dark:bg-primary-700",
    "hover": "hover:text-white hover:bg-primary-600 dark:hover:bg-primary-600",
    "focus":
      "focus:text-white focus:ring-offset-2 focus:bg-primary-600 focus:ring-primary-600 dark:focus:bg-primary-600 dark:focus:ring-primary-600",
  },
  "success": {
    "base": "text-white bg-success-500 dark:bg-success-700",
    "hover": "hover:text-white hover:bg-success-600 dark:hover:bg-success-600",
    "focus":
      "focus:text-white focus:ring-offset-2 focus:bg-success-600 focus:ring-success-600 dark:focus:bg-success-600 dark:focus:ring-success-600",
  },
  "warning": {
    "base": "text-white bg-warning-500 dark:bg-warning-700",
    "hover": "hover:text-white hover:bg-warning-600 dark:hover:bg-warning-600",
    "focus":
      "focus:text-white focus:ring-offset-2 focus:bg-warning-600 focus:ring-warning-600 dark:focus:bg-warning-600 dark:focus:ring-warning-600",
  },
  "secondary": {
    "base": "text-white bg-secondary-500 dark:bg-secondary-700",
    "hover":
      "hover:text-white hover:bg-secondary-600 dark:hover:bg-secondary-600",
    "focus":
      "focus:text-white focus:ring-offset-2 focus:bg-secondary-600 focus:ring-secondary-600 dark:focus:bg-secondary-600 dark:focus:ring-secondary-600",
  },
};

export const outlineProps: ButtonColor = {
  "info": {
    "base": "text-info-600 border border-info-600",
    "hover":
      "hover:text-info-700 hover:bg-info-400/25 dark:hover:text-info-500 dark:hover:bg-info-600/15",
    "focus":
      "focus:border-transparent dark:focus:border-transparent focus:ring-offset-0 focus:text-info-700 focus:bg-info-400/25 focus:ring-info-600 dark:focus:text-info-500 dark:focus:bg-info-600/15 dark:focus:ring-info-700",
  },
  "error": {
    "base": "text-error-600 border border-error-600",
    "hover":
      "hover:text-error-700 hover:bg-error-400/25 dark:hover:text-error-500 dark:hover:bg-error-600/15",
    "focus":
      "focus:border-transparent dark:focus:border-transparent focus:ring-offset-0 focus:text-error-700 focus:bg-error-400/25 focus:ring-error-600 dark:focus:text-error-500 dark:focus:bg-error-600/15 dark:focus:ring-error-700",
  },
  "primary": {
    "base": "text-primary-600 border border-primary-600",
    "hover":
      "hover:text-primary-700 hover:bg-primary-400/25 dark:hover:text-primary-500 dark:hover:bg-primary-600/15",
    "focus":
      "focus:border-transparent dark:focus:border-transparent focus:ring-offset-0 focus:text-primary-700 focus:bg-primary-400/25 focus:ring-primary-600 dark:focus:text-primary-500 dark:focus:bg-primary-600/15 dark:focus:ring-primary-700",
  },
  "warning": {
    "base": "text-warning-600 border border-warning-600",
    "hover":
      "hover:text-warning-700 hover:bg-warning-400/25 dark:hover:text-warning-500 dark:hover:bg-warning-600/15",
    "focus":
      "focus:border-transparent dark:focus:border-transparent focus:ring-offset-0 focus:text-warning-700 focus:bg-warning-400/25 focus:ring-warning-600 dark:focus:text-warning-500 dark:focus:bg-warning-600/15 dark:focus:ring-warning-700",
  },
  "dark": {
    "base":
      "text-dark-600 border border-dark-600 dark:text-dark-400 dark:border-dark-400",
    "hover":
      "hover:text-dark-700 hover:bg-dark-400/25 dark:hover:text-dark-300/90 dark:hover:bg-dark-400/15",
    "focus":
      "focus:border-transparent dark:focus:border-transparent focus:ring-offset-0 focus:text-dark-700 focus:bg-dark-400/25 focus:ring-dark-600 dark:focus:text-dark-300/90 dark:focus:bg-dark-400/15 dark:focus:ring-dark-500",
  },
  "secondary": {
    "base": "text-secondary-600 border border-secondary-600",
    "hover":
      "hover:text-secondary-700 hover:bg-secondary-400/25 dark:hover:text-secondary-500 dark:hover:bg-secondary-600/15",
    "focus":
      "focus:border-transparent dark:focus:border-transparent focus:ring-offset-0 focus:text-secondary-700 focus:bg-secondary-400/25 focus:ring-secondary-600 dark:focus:text-secondary-500 dark:focus:bg-secondary-600/15 dark:focus:ring-secondary-700",
  },
  "success": {
    "base":
      "text-success-600 border border-success-600 dark:text-success-500/90 dark:border-success-500/80",
    "hover":
      "hover:text-success-700 hover:bg-success-400/25 dark:hover:text-success-500 dark:hover:bg-success-600/15",
    "focus":
      "focus:border-transparent dark:focus:border-transparent focus:ring-offset-0 focus:text-success-700 focus:bg-success-400/25 focus:ring-success-600 dark:focus:text-success-500 dark:focus:bg-success-600/15 dark:focus:ring-success-700",
  },
};
