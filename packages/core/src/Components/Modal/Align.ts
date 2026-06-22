export interface ModalAlign {
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
   * Flex alignment classes for the `middle-center` placement.
   */
  "middle-center": string;

  /**
   * Flex alignment classes for the `middle-end` placement.
   */
  "middle-end": string;

  /**
   * Flex alignment classes for the `middle-start` placement.
   */
  "middle-start": string;

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

export const alignProps: ModalAlign = {
  "top-end": "sm:items-start sm:justify-end",
  "bottom-end": "sm:items-end sm:justify-end",
  "top-start": "sm:items-start sm:justify-start",
  "middle-end": "sm:items-center sm:justify-end",
  "bottom-start": "sm:items-end sm:justify-start",
  "top-center": "sm:items-start sm:justify-center",
  "bottom-center": "sm:items-end sm:justify-center",
  "middle-start": "sm:items-center sm:justify-start",
  "middle-center": "sm:items-center sm:justify-center",
};
