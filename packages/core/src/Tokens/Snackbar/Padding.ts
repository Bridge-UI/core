export interface SnackbarPaddingItem {
  /**
   * Padding for the main content area.
   */
  "content": string;
}

export interface SnackbarPadding {
  /**
   * Padding scale token `large`.
   */
  "large": SnackbarPaddingItem;

  /**
   * Padding scale token `medium`.
   */
  "medium": SnackbarPaddingItem;

  /**
   * No padding.
   */
  "none": SnackbarPaddingItem;

  /**
   * Padding scale token `small`.
   */
  "small": SnackbarPaddingItem;
}

export const paddingProps: SnackbarPadding = {
  "none": {
    "content": "p-0",
  },
  "large": {
    "content": "p-5",
  },
  "medium": {
    "content": "p-4",
  },
  "small": {
    "content": "px-4 py-3",
  },
};
