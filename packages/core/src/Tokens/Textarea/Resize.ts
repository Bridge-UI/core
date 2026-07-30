export interface TextareaResize {
  /**
   * Resize horizontally and vertically.
   */
  "both": string;

  /**
   * Resize horizontally only.
   */
  "horizontal": string;

  /**
   * No effect (empty token).
   */
  "none": string;

  /**
   * Resize vertically only.
   */
  "vertical": string;
}

export const resizeProps: TextareaResize = {
  "both": "resize",
  "none": "resize-none",
  "vertical": "resize-y",
  "horizontal": "resize-x",
};
