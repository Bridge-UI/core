export interface AlertPadding {
  /**
   * Classes for the `large` token.
   */
  "large": string;

  /**
   * Classes for the `medium` token.
   */
  "medium": string;

  /**
   * No effect (empty token).
   */
  "none": string;

  /**
   * Classes for the `small` token.
   */
  "small": string;
}

export const paddingProps: AlertPadding = {
  "none": "ms-2",
  "small": "ps-1 mt-1 ms-3",
  "large": "ps-1 mt-3 ms-7",
  "medium": "ps-1 mt-2 ms-5",
};
