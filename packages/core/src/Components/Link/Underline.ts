// prettier-ignore
export interface LinkUnderline {
  "always": string;
  "none": string;
  "hover": string;
}

// prettier-ignore
export const underlineProps: LinkUnderline = {
  "always": "underline",
  "none": "no-underline",
  "hover": "no-underline hover:underline",
};
