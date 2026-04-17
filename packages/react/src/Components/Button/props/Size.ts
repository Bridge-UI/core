export interface ButtonSizes {
  xxs: string;
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl: string;
}

export const base: ButtonSizes = {
  xxs: "gap-x-0.5 text-2xs px-2 py-0.5",
  xs: "gap-x-1 text-xs px-2.5 py-1.5",
  sm: "gap-x-2 text-sm leading-4 px-3 py-2",
  md: "gap-x-2 text-sm px-4 py-2",
  lg: "gap-x-2 text-base px-4 py-2.5",
  xl: "gap-x-2 text-lg px-6 py-3",
  xxl: "gap-x-3 text-xl px-7 py-4",
};

export const mini: ButtonSizes = {
  xxs: "text-2xs w-5 h-5",
  xs: "text-xs w-7 h-7",
  sm: "text-sm w-8 h-8",
  md: "text-sm w-9 h-9",
  lg: "text-base w-10 h-10",
  xl: "text-lg w-12 h-12",
  xxl: "text-xl w-14 h-14",
};
