/**
 * Text color classes read at runtime for chart chrome. Adapters receive
 * the computed colors, so dark mode and theme variables apply.
 */
export interface ChartTheme {
  /**
   * Axis line color classes.
   */
  "axis": string;

  /**
   * Grid line color classes.
   */
  "grid": string;

  /**
   * Axis label and title color classes.
   */
  "text": string;
}

export const themeProps: ChartTheme = {
  "grid": "text-dark-200 dark:text-dark-700",
  "axis": "text-dark-300 dark:text-dark-600",
  "text": "text-dark-500 dark:text-dark-400",
};
