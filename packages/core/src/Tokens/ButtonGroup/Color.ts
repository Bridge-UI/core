/**
 * Divider fill classes per button variant.
 */
export interface ButtonGroupColorItem {
  /**
   * Divider fill for the `flat` variant.
   */
  "flat": string;

  /**
   * Divider fill for the `light` variant.
   */
  "light": string;

  /**
   * Divider fill for the `outline` variant.
   */
  "outline": string;

  /**
   * Divider fill for the `solid` variant.
   */
  "solid": string;
}

/**
 * Separator color of the button group divider.
 */
export interface ButtonGroupColor {
  /**
   * `dark` semantic color palette.
   */
  "dark": ButtonGroupColorItem;

  /**
   * `error` semantic color palette.
   */
  "error": ButtonGroupColorItem;

  /**
   * `info` semantic color palette.
   */
  "info": ButtonGroupColorItem;

  /**
   * `primary` semantic color palette.
   */
  "primary": ButtonGroupColorItem;

  /**
   * `secondary` semantic color palette.
   */
  "secondary": ButtonGroupColorItem;

  /**
   * `success` semantic color palette.
   */
  "success": ButtonGroupColorItem;

  /**
   * `warning` semantic color palette.
   */
  "warning": ButtonGroupColorItem;
}

const lightFill =
  "[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:bg-white/50 dark:[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:bg-white/20";

const solidFill =
  "[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:bg-white/25";

/**
 * Divider fill classes by semantic color and variant.
 */
export const colorProps: ButtonGroupColor = {
  "dark": {
    "flat":
      "[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:bg-dark-200 dark:[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:bg-dark-600",
    "light": lightFill,
    "outline":
      "[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:bg-dark-600 dark:[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:bg-dark-400",
    "solid": solidFill,
  },
  "info": {
    "flat":
      "[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:bg-info-200 dark:[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:bg-info-700",
    "light": lightFill,
    "outline":
      "[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:bg-info-600",
    "solid": solidFill,
  },
  "error": {
    "flat":
      "[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:bg-error-200 dark:[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:bg-error-700",
    "light": lightFill,
    "outline":
      "[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:bg-error-600",
    "solid": solidFill,
  },
  "primary": {
    "flat":
      "[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:bg-primary-200 dark:[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:bg-primary-700",
    "light": lightFill,
    "outline":
      "[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:bg-primary-600",
    "solid": solidFill,
  },
  "success": {
    "flat":
      "[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:bg-success-200 dark:[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:bg-success-700",
    "light": lightFill,
    "outline":
      "[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:bg-success-600 dark:[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:bg-success-500/80",
    "solid": solidFill,
  },
  "warning": {
    "flat":
      "[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:bg-warning-200 dark:[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:bg-warning-700",
    "light": lightFill,
    "outline":
      "[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:bg-warning-600",
    "solid": solidFill,
  },
  "secondary": {
    "flat":
      "[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:bg-secondary-200 dark:[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:bg-secondary-700",
    "light": lightFill,
    "outline":
      "[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:bg-secondary-600",
    "solid": solidFill,
  },
};
