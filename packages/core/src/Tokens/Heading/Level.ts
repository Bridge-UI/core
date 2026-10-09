export interface HeadingLevel {
  /**
   * Font size classes for `h1` when `size` is not set.
   */
  "1": string;

  /**
   * Font size classes for `h2` when `size` is not set.
   */
  "2": string;

  /**
   * Font size classes for `h3` when `size` is not set.
   */
  "3": string;

  /**
   * Font size classes for `h4` when `size` is not set.
   */
  "4": string;

  /**
   * Font size classes for `h5` when `size` is not set.
   */
  "5": string;

  /**
   * Font size classes for `h6` when `size` is not set.
   */
  "6": string;
}

export const levelProps: HeadingLevel = {
  "3": "text-xl",
  "4": "text-lg",
  "6": "text-sm",
  "1": "text-3xl",
  "2": "text-2xl",
  "5": "text-base",
};
