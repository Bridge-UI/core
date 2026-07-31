export interface LinkUnderline {
  /**
   * Underline always visible.
   */
  "always": string;

  /**
   * Underline on hover only.
   */
  "hover": string;

  /**
   * No effect (empty token).
   */
  "none": string;
}

export const underlineProps: LinkUnderline = {
  "always": "underline",
  "none": "no-underline",
  "hover": "no-underline hover:underline",
};
