// prettier-ignore
export interface TextareaResize {
  "both": string;
  "none": string;
  "vertical": string;
  "horizontal": string;
}

// prettier-ignore
export const resizeProps: TextareaResize = {
  "both": "resize",
  "none": "resize-none",
  "vertical": "resize-y",
  "horizontal": "resize-x",
};
