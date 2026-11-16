export interface CardPaddingItem {
  /**
   * Body region padding classes.
   */
  "body": string;

  /**
   * Footer region padding classes.
   */
  "footer": string;

  /**
   * Header region padding classes.
   */
  "header": string;
}

export interface CardPadding {
  /**
   * Padding scale token `large`.
   */
  "large": CardPaddingItem;

  /**
   * Padding scale token `medium`.
   */
  "medium": CardPaddingItem;

  /**
   * No effect (empty token).
   */
  "none": CardPaddingItem;

  /**
   * Padding scale token `small`.
   */
  "small": CardPaddingItem;
}

export const paddingProps: CardPadding = {
  "none": {
    "body": "p-0",
    "footer": "p-0",
    "header": "p-0",
  },
  "small": {
    "body": "px-2 py-3",
    "footer": "px-2 py-3",
    "header": "px-2 py-2.5",
  },
  "large": {
    "body": "px-5 py-6",
    "footer": "px-5 py-4",
    "header": "px-5 py-2.5",
  },
  "medium": {
    "body": "px-4 py-5",
    "footer": "px-4 py-4",
    "header": "px-4 py-2.5",
  },
};
