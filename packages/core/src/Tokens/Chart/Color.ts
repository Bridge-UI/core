export interface ChartColorItem {
  /**
   * Text color classes read at runtime to resolve the series color
   * (the plot receives the computed CSS color, not the class).
   */
  "series": string;
}

export interface ChartColor {
  /**
   * `black` high-contrast palette (black / white only).
   */
  "black": ChartColorItem;

  /**
   * `dark` semantic color palette.
   */
  "dark": ChartColorItem;

  /**
   * `error` semantic color palette.
   */
  "error": ChartColorItem;

  /**
   * Info semantic color palette.
   */
  "info": ChartColorItem;

  /**
   * `primary` semantic color palette.
   */
  "primary": ChartColorItem;

  /**
   * `secondary` semantic color palette.
   */
  "secondary": ChartColorItem;

  /**
   * `success` semantic color palette.
   */
  "success": ChartColorItem;

  /**
   * `warning` semantic color palette.
   */
  "warning": ChartColorItem;
}

export const colorProps: ChartColor = {
  "black": {
    "series": "text-black dark:text-white",
  },
  "dark": {
    "series": "text-dark-500 dark:text-dark-400",
  },
  "info": {
    "series": "text-info-500 dark:text-info-400",
  },
  "error": {
    "series": "text-error-500 dark:text-error-400",
  },
  "primary": {
    "series": "text-primary-500 dark:text-primary-400",
  },
  "success": {
    "series": "text-success-500 dark:text-success-400",
  },
  "warning": {
    "series": "text-warning-500 dark:text-warning-400",
  },
  "secondary": {
    "series": "text-secondary-500 dark:text-secondary-400",
  },
};
