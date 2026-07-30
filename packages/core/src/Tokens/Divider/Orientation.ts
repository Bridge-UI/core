export interface DividerOrientation {
  /**
   * Horizontal divider (full width, 1px tall).
   */
  "horizontal": string;

  /**
   * Vertical divider (stretch height, 1px wide).
   */
  "vertical": string;
}

export const orientationProps: DividerOrientation = {
  "horizontal": "h-px w-full",
  "vertical": "w-px self-stretch h-auto min-h-full",
};
