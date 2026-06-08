export interface CardRoundedItem {
  "footer": string;
  "header": string;
  "root": string;
}

export interface CardRounded {
  "2xl": CardRoundedItem;
  "3xl": CardRoundedItem;
  "4xl": CardRoundedItem;
  "full": CardRoundedItem;
  "lg": CardRoundedItem;
  "md": CardRoundedItem;
  "none": CardRoundedItem;
  "sm": CardRoundedItem;
  "xl": CardRoundedItem;
  "xs": CardRoundedItem;
}

export const roundedProps: CardRounded = {
  "xs": {
    "root": "rounded-xs",
    "header": "rounded-t-xs",
    "footer": "rounded-b-xs",
  },
  "sm": {
    "root": "rounded-sm",
    "header": "rounded-t-sm",
    "footer": "rounded-b-sm",
  },
  "md": {
    "root": "rounded-md",
    "header": "rounded-t-md",
    "footer": "rounded-b-md",
  },
  "lg": {
    "root": "rounded-lg",
    "header": "rounded-t-lg",
    "footer": "rounded-b-lg",
  },
  "xl": {
    "root": "rounded-xl",
    "header": "rounded-t-xl",
    "footer": "rounded-b-xl",
  },
  "2xl": {
    "root": "rounded-2xl",
    "header": "rounded-t-2xl",
    "footer": "rounded-b-2xl",
  },
  "3xl": {
    "root": "rounded-3xl",
    "header": "rounded-t-3xl",
    "footer": "rounded-b-3xl",
  },
  "4xl": {
    "root": "rounded-4xl",
    "header": "rounded-t-4xl",
    "footer": "rounded-b-4xl",
  },
  "none": {
    "root": "rounded-none",
    "header": "rounded-t-none",
    "footer": "rounded-b-none",
  },
  "full": {
    "root": "rounded-full",
    "header": "rounded-t-full",
    "footer": "rounded-b-full",
  },
};
