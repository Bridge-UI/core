export interface BadgeSize {
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

export const miniSizeProps: BadgeSize = {
  "sm": "text-xs px-1 py-0 w-6 h-6",
  "xs": "text-2xs px-1 py-0 w-5 h-5",
  "lg": "text-sm px-2 py-0.5 w-8 h-8",
  "xl": "text-sm px-2.5 py-1 w-9 h-9",
  "2xs": "text-2xs px-0.5 py-0 w-4 h-4",
  "md": "text-xs px-1.5 py-0.5 w-7 h-7",
  "2xl": "text-base px-3 py-1 w-10 h-10",
};

export const defaultSizeProps: BadgeSize = {
  "lg": "text-sm px-3 py-1",
  "2xl": "text-lg px-4 py-2",
  "sm": "text-xs px-2 py-0.5",
  "md": "text-sm px-2.5 py-1",
  "2xs": "text-2xs px-1 py-0.5",
  "xs": "text-xs px-1.5 py-0.5",
  "xl": "text-base px-3 py-1.5",
};
