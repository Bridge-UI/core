export interface AlertPaddingItem {
  /**
   * Indent for the body under the title row.
   */
  "body": string;

  /**
   * Padding for the alert root.
   */
  "root": string;
}

export interface AlertPadding {
  /**
   * Classes for the `large` token.
   */
  "large": AlertPaddingItem;

  /**
   * Classes for the `medium` token.
   */
  "medium": AlertPaddingItem;

  /**
   * No padding on the root.
   */
  "none": AlertPaddingItem;

  /**
   * Classes for the `small` token.
   */
  "small": AlertPaddingItem;
}

export const paddingProps: AlertPadding = {
  "none": {
    "root": "p-0",
    "body": "ms-2",
  },
  "small": {
    "root": "p-2",
    "body": "ps-1 mt-1 ms-3",
  },
  "large": {
    "root": "p-6",
    "body": "ps-1 mt-3 ms-7",
  },
  "medium": {
    "root": "p-4",
    "body": "ps-1 mt-2 ms-5",
  },
};
