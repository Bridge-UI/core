export interface ButtonSize {
  "2xl": string;
  "2xs": string;
  "lg": string;
  "md": string;
  "sm": string;
  "xl": string;
  "xs": string;
}

export const miniSizeProps: ButtonSize = {
  "sm": "text-xs w-6 h-6",
  "md": "text-xs w-7 h-7",
  "lg": "text-sm w-8 h-8",
  "xl": "text-sm w-9 h-9",
  "xs": "text-2xs w-5 h-5",
  "2xs": "text-2xs w-4 h-4",
  "2xl": "text-base w-10 h-10",
};

export const defaultSizeProps: ButtonSize = {
  "md": "gap-x-2 text-sm px-4 py-2",
  "2xl": "gap-x-3 text-lg px-7 py-4",
  "lg": "gap-x-2 text-sm px-4 py-2.5",
  "xl": "gap-x-2 text-base px-6 py-3",
  "xs": "gap-x-1 text-xs px-2.5 py-1.5",
  "2xs": "gap-x-0.5 text-2xs px-2 py-0.5",
  "sm": "gap-x-2 text-xs leading-4 px-3 py-2",
};
