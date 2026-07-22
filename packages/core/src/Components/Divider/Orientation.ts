export interface DividerOrientation {
  /**
   * Horizontal divider (full width, top border).
   */
  "horizontal": string;

  /**
   * Vertical divider (stretch height, left border).
   */
  "vertical": string;
}

export const orientationProps: DividerOrientation = {
  "horizontal": "w-full border-t",
  "vertical": "self-stretch h-auto min-h-full border-l",
};
