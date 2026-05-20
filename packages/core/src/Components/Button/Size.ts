// prettier-ignore
export interface ButtonSize {
  "2xs": string;
  "xs": string;
  "sm": string;
  "md": string;
  "lg": string;
  "xl": string;
  "2xl": string;
}

// prettier-ignore
export const miniSizeProps: ButtonSize = {
  "2xs": "text-2xs w-4 h-4",
  "xs": "text-2xs w-5 h-5",
  "sm": "text-xs w-6 h-6",
  "md": "text-xs w-7 h-7",
  "lg": "text-sm w-8 h-8",
  "xl": "text-sm w-9 h-9",
  "2xl": "text-base w-10 h-10",
};

// prettier-ignore
export const defaultSizeProps: ButtonSize = {
  "2xs": "gap-x-0.5 text-2xs px-2 py-0.5",
  "xs": "gap-x-1 text-xs px-2.5 py-1.5",
  "sm": "gap-x-2 text-xs leading-4 px-3 py-2",
  "md": "gap-x-2 text-sm px-4 py-2",
  "lg": "gap-x-2 text-sm px-4 py-2.5",
  "xl": "gap-x-2 text-base px-6 py-3",
  "2xl": "gap-x-3 text-lg px-7 py-4",
};
