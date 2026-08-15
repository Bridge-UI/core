/**
 * Per-color selected-state classes for toggle group segments.
 * Inactive items use `dark-*` from the variant; these apply when selected.
 */
export interface ToggleGroupColorItem {
  /**
   * Text accent for the selected segment.
   */
  "itemSelected": string;

  /**
   * Soft background fill for `solid` selected segments.
   */
  "itemSelectedSoft": string;
}

/**
 * ToggleGroup color tokens (selected accent).
 */
export interface ToggleGroupColor {
  /**
   * `dark` semantic color palette.
   */
  "dark": ToggleGroupColorItem;

  /**
   * `error` semantic color palette.
   */
  "error": ToggleGroupColorItem;

  /**
   * Info semantic color palette.
   */
  "info": ToggleGroupColorItem;

  /**
   * `primary` semantic color palette.
   */
  "primary": ToggleGroupColorItem;

  /**
   * `secondary` semantic color palette.
   */
  "secondary": ToggleGroupColorItem;

  /**
   * `success` semantic color palette.
   */
  "success": ToggleGroupColorItem;

  /**
   * `warning` semantic color palette.
   */
  "warning": ToggleGroupColorItem;
}

/**
 * Default toggle group color maps (selected only).
 */
export const colorProps: ToggleGroupColor = {
  "dark": {
    "itemSelectedSoft": "bg-dark-500/10 dark:bg-dark-500/20",
    "itemSelected":
      "text-dark-800 hover:text-dark-800 dark:text-dark-100 dark:hover:text-dark-100",
  },
  "info": {
    "itemSelectedSoft": "bg-info-500/15 dark:bg-info-500/20",
    "itemSelected":
      "text-info-600 hover:text-info-600 dark:text-info-400 dark:hover:text-info-400",
  },
  "error": {
    "itemSelectedSoft": "bg-error-500/15 dark:bg-error-500/20",
    "itemSelected":
      "text-error-600 hover:text-error-600 dark:text-error-400 dark:hover:text-error-400",
  },
  "primary": {
    "itemSelectedSoft": "bg-primary-500/15 dark:bg-primary-500/20",
    "itemSelected":
      "text-primary-600 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-400",
  },
  "success": {
    "itemSelectedSoft": "bg-success-500/15 dark:bg-success-500/20",
    "itemSelected":
      "text-success-600 hover:text-success-600 dark:text-success-400 dark:hover:text-success-400",
  },
  "warning": {
    "itemSelectedSoft": "bg-warning-500/15 dark:bg-warning-500/20",
    "itemSelected":
      "text-warning-600 hover:text-warning-600 dark:text-warning-400 dark:hover:text-warning-400",
  },
  "secondary": {
    "itemSelectedSoft": "bg-secondary-500/15 dark:bg-secondary-500/20",
    "itemSelected":
      "text-secondary-600 hover:text-secondary-600 dark:text-secondary-400 dark:hover:text-secondary-400",
  },
};
