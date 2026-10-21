export interface ButtonSize {
  /**
   * Max-width classes for the `2xl` size token.
   */
  "2xl": string;

  /**
   * Max-width classes for the `2xs` size token.
   */
  "2xs": string;

  /**
   * Max-width classes for the `lg` size token.
   */
  "lg": string;

  /**
   * Max-width classes for the `md` size token.
   */
  "md": string;

  /**
   * Max-width classes for the `sm` size token.
   */
  "sm": string;

  /**
   * Max-width classes for the `xl` size token.
   */
  "xl": string;

  /**
   * Max-width classes for the `xs` size token.
   */
  "xs": string;
}

export const miniSizeProps: ButtonSize = {
  "sm": "text-xs w-8 h-8 min-w-8 min-h-8",
  "md": "text-sm w-9 h-9 min-w-9 min-h-9",
  "xs": "text-xs w-7 h-7 min-w-7 min-h-7",
  "2xs": "text-2xs w-6 h-6 min-w-6 min-h-6",
  "lg": "text-sm w-10 h-10 min-w-10 min-h-10",
  "2xl": "text-lg w-12 h-12 min-w-12 min-h-12",
  "xl": "text-base w-11 h-11 min-w-11 min-h-11",
};

export const defaultSizeProps: ButtonSize = {
  "md": "gap-x-2 text-sm h-9 px-4",
  "sm": "gap-x-2 text-xs h-8 px-3",
  "lg": "gap-x-2 text-sm h-10 px-4",
  "2xl": "gap-x-3 text-lg h-12 px-6",
  "xs": "gap-x-1 text-xs h-7 px-2.5",
  "xl": "gap-x-2 text-base h-11 px-5",
  "2xs": "gap-x-0.5 text-2xs h-6 px-2",
};
