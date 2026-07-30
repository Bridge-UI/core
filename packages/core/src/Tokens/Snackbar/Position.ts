export interface SnackbarPosition {
  /**
   * Flex alignment classes for the `bottom-center` placement.
   */
  "bottom-center": string;

  /**
   * Flex alignment classes for the `bottom-end` placement.
   */
  "bottom-end": string;

  /**
   * Flex alignment classes for the `bottom-start` placement.
   */
  "bottom-start": string;

  /**
   * Flex alignment classes for the `top-center` placement.
   */
  "top-center": string;

  /**
   * Flex alignment classes for the `top-end` placement.
   */
  "top-end": string;

  /**
   * Flex alignment classes for the `top-start` placement.
   */
  "top-start": string;
}

export const positionProps: SnackbarPosition = {
  "top-end": "items-start justify-end",
  "bottom-end": "items-end justify-end",
  "top-start": "items-start justify-start",
  "bottom-start": "items-end justify-start",
  "top-center": "items-start justify-center",
  "bottom-center": "items-end justify-center",
};
