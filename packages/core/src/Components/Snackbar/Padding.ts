export interface SnackbarPaddingItem {
  /**
   * Padding for the main content area.
   */
  "content": string;

  /**
   * Padding for the main content area when a `right` slot is present.
   */
  "contentRight": string;
}

export interface SnackbarPadding {
  "large": SnackbarPaddingItem;
  "medium": SnackbarPaddingItem;
  "none": SnackbarPaddingItem;
  "small": SnackbarPaddingItem;
}

export const paddingProps: SnackbarPadding = {
  "none": {
    "content": "p-0",
    "contentRight": "w-0 flex-1 flex items-center p-0",
  },
  "large": {
    "content": "p-5",
    "contentRight": "w-0 flex-1 flex items-center p-5",
  },
  "medium": {
    "content": "p-4",
    "contentRight": "w-0 flex-1 flex items-center p-4",
  },
  "small": {
    "content": "py-3 pl-4 pr-4",
    "contentRight": "w-0 flex-1 flex items-center py-3 pl-4 pr-4",
  },
};
