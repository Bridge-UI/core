// prettier-ignore
export interface CardPadding {
  "none": string;
  "small": string;
  "medium": string;
  "large": string;
}

// prettier-ignore
export const paddingProps: CardPadding = {
  "none": "p-0",
  "small": "px-1 py-3 md:px-2",
  "medium": "px-2 py-5 md:px-4",
  "large": "px-3 py-6 md:px-5",
};
