// prettier-ignore
export interface LinkUnderline {
  "always": string;
  "hover": string;
  "none": string;
}

// prettier-ignore
export const underlineProps: LinkUnderline = {
  "always": "underline",
  "none": "no-underline",
  "hover": "no-underline hover:underline",
};
