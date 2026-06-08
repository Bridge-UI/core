export interface ModalSize {
  "2xl": string;
  "3xl": string;
  "4xl": string;
  "5xl": string;
  "6xl": string;
  "7xl": string;
  "full": string;
  "lg": string;
  "md": string;
  "sm": string;
  "xl": string;
  "xs": string;
}

export const sizeProps: ModalSize = {
  "xs": "sm:max-w-xs",
  "sm": "sm:max-w-sm",
  "md": "sm:max-w-md",
  "lg": "sm:max-w-lg",
  "xl": "sm:max-w-xl",
  "2xl": "sm:max-w-2xl",
  "3xl": "sm:max-w-3xl",
  "4xl": "sm:max-w-4xl",
  "5xl": "sm:max-w-5xl",
  "6xl": "sm:max-w-6xl",
  "7xl": "sm:max-w-7xl",
  "full": "sm:max-w-full",
};
