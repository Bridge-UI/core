// prettier-ignore
export interface TextFieldRoundedItem {
  "end": string;
  "input": string;
  "start": string;
}

// prettier-ignore
export interface TextFieldRounded {
  "none": TextFieldRoundedItem;
  "xs": TextFieldRoundedItem;
  "sm": TextFieldRoundedItem;
  "md": TextFieldRoundedItem;
  "lg": TextFieldRoundedItem;
  "xl": TextFieldRoundedItem;
  "2xl": TextFieldRoundedItem;
  "3xl": TextFieldRoundedItem;
  "4xl": TextFieldRoundedItem;
  "full": TextFieldRoundedItem;
}

// prettier-ignore
export const roundedProps: TextFieldRounded = {
  "none": {
    "end": "rounded-none",
    "input": "rounded-none",
    "start": "rounded-none",
  },
  "xs": {
    "end": "rounded-e-xs",
    "input": "rounded-xs",
    "start": "rounded-s-xs",
  },
  "sm": {
    "end": "rounded-e-sm",
    "input": "rounded-sm",
    "start": "rounded-s-sm",
  },
  "md": {
    "end": "rounded-e-md",
    "input": "rounded-md",
    "start": "rounded-s-md",
  },
  "lg": {
    "end": "rounded-e-lg",
    "input": "rounded-lg",
    "start": "rounded-s-lg",
  },
  "xl": {
    "end": "rounded-e-xl",
    "input": "rounded-xl",
    "start": "rounded-s-xl",
  },
  "2xl": {
    "end": "rounded-e-2xl",
    "input": "rounded-2xl",
    "start": "rounded-s-2xl",
  },
  "3xl": {
    "end": "rounded-e-3xl",
    "input": "rounded-3xl",
    "start": "rounded-s-3xl",
  },
  "4xl": {
    "end": "rounded-e-4xl",
    "input": "rounded-4xl",
    "start": "rounded-s-4xl",
  },
  "full": {
    "end": "rounded-e-full",
    "input": "rounded-full",
    "start": "rounded-s-full",
  },
};
