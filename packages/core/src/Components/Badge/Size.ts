// prettier-ignore
export interface BadgeSize {
  "2xs": string;
  "xs": string;
  "sm": string;
  "md": string;
  "lg": string;
  "xl": string;
}

// prettier-ignore
export const sizeProps: BadgeSize = {
  "2xs": "text-2xs px-1 py-0.5",
  "xs": "text-xs px-1.5 py-0.5",
  "sm": "text-xs px-2 py-0.5",
  "md": "text-sm px-2.5 py-1",
  "lg": "text-sm px-3 py-1",
  "xl": "text-base px-3 py-1.5",
};
