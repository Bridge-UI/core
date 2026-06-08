export interface TextareaResize {
  "both": string;
  "horizontal": string;
  "none": string;
  "vertical": string;
}

export const resizeProps: TextareaResize = {
  "both": "resize",
  "none": "resize-none",
  "vertical": "resize-y",
  "horizontal": "resize-x",
};
