// prettier-ignore
export interface CardPaddingItem {
  "body": string;
  "footer": string;
  "header": string;
}

// prettier-ignore
export interface CardPadding {
  "none": CardPaddingItem;
  "small": CardPaddingItem;
  "medium": CardPaddingItem;
  "large": CardPaddingItem;
}

// prettier-ignore
export const paddingProps: CardPadding = {
  "none": {
    "body": "p-0",
    "footer": "p-0",
    "header": "p-0",
  },
  "small": {
    "body": "px-1 py-3 md:px-2",
    "footer": "px-1 py-3 md:px-2",
    "header": "px-1 py-2.5 md:px-2",
  },
  "medium": {
    "body": "px-2 py-5 md:px-4",
    "footer": "px-2 py-4 md:px-4",
    "header": "px-2 py-2.5 md:px-4",
  },
  "large": {
    "body": "px-3 py-6 md:px-5",
    "footer": "px-3 py-4 md:px-5",
    "header": "px-3 py-2.5 md:px-5",
  },
};
