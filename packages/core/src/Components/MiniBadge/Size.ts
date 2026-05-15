// prettier-ignore
export interface MiniBadgeSize {
  "2xs": string;
  "xs": string;
  "sm": string;
  "md": string;
  "lg": string;
  "xl": string;
  "2xl": string;
}

// prettier-ignore
export const sizeProps: MiniBadgeSize = {
  "2xs": "text-2xs px-0.5 py-0 min-w-4 h-4",
  "xs": "text-2xs px-1 py-0 min-w-5 h-5",
  "sm": "text-xs px-1 py-0 min-w-6 h-6",
  "md": "text-xs px-1.5 py-0.5 min-w-7 h-7",
  "lg": "text-sm px-2 py-0.5 min-w-8 h-8",
  "xl": "text-sm px-2.5 py-1 min-w-9 h-9",
  "2xl": "text-base px-3 py-1 min-w-10 h-10",
};
