// prettier-ignore
export interface BadgeSize {
  "2xs": string;
  "xs": string;
  "sm": string;
  "md": string;
  "lg": string;
  "xl": string;
  "2xl": string;
}

// prettier-ignore
export const miniSizeProps: BadgeSize = {
  "2xs": "text-2xs px-0.5 py-0 w-4 h-4",
  "xs": "text-2xs px-1 py-0 w-5 h-5",
  "sm": "text-xs px-1 py-0 w-6 h-6",
  "md": "text-xs px-1.5 py-0.5 w-7 h-7",
  "lg": "text-sm px-2 py-0.5 w-8 h-8",
  "xl": "text-sm px-2.5 py-1 w-9 h-9",
  "2xl": "text-base px-3 py-1 w-10 h-10",
};

// prettier-ignore
export const defaultSizeProps: BadgeSize = {
  "2xs": "text-2xs px-1 py-0.5",
  "xs": "text-xs px-1.5 py-0.5",
  "sm": "text-xs px-2 py-0.5",
  "md": "text-sm px-2.5 py-1",
  "lg": "text-sm px-3 py-1",
  "xl": "text-base px-3 py-1.5",
  "2xl": "text-lg px-4 py-2",
};
