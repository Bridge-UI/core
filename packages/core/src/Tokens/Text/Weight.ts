export interface TextWeight {
  /**
   * Bold font weight.
   */
  "bold": string;

  /**
   * Medium font weight.
   */
  "medium": string;

  /**
   * Regular font weight.
   */
  "normal": string;

  /**
   * Semibold font weight.
   */
  "semibold": string;
}

export const weightProps: TextWeight = {
  "bold": "font-bold",
  "medium": "font-medium",
  "normal": "font-normal",
  "semibold": "font-semibold",
};
