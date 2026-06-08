export interface LinkUnderline {
  "always": string;
  "hover": string;
  "none": string;
}

export const underlineProps: LinkUnderline = {
  "always": "underline",
  "none": "no-underline",
  "hover": "no-underline hover:underline",
};
