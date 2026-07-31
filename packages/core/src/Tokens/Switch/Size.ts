export interface SwitchSizeItem {
  /**
   * Thumb element classes.
   */
  "thumb": string;

  /**
   * Thumb translate classes when checked.
   */
  "thumbCheckedTranslate": string;

  /**
   * Track element classes.
   */
  "track": string;
}

export interface SwitchSize {
  /**
   * Size scale token `2xl`.
   */
  "2xl": SwitchSizeItem;

  /**
   * Size scale token `2xs`.
   */
  "2xs": SwitchSizeItem;

  /**
   * Size scale token `lg`.
   */
  "lg": SwitchSizeItem;

  /**
   * Size scale token `md`.
   */
  "md": SwitchSizeItem;

  /**
   * Size scale token `sm`.
   */
  "sm": SwitchSizeItem;

  /**
   * Size scale token `xl`.
   */
  "xl": SwitchSizeItem;

  /**
   * Size scale token `xs`.
   */
  "xs": SwitchSizeItem;
}

export const sizeProps: SwitchSize = {
  "xs": {
    "track": "h-4 w-7",
    "thumb": "h-3 w-3",
    "thumbCheckedTranslate": "translate-x-3",
  },
  "sm": {
    "track": "h-4 w-7",
    "thumb": "h-3 w-3",
    "thumbCheckedTranslate": "translate-x-3",
  },
  "lg": {
    "thumb": "h-4 w-4",
    "track": "h-6 w-10",
    "thumbCheckedTranslate": "translate-x-5",
  },
  "xl": {
    "thumb": "h-4 w-4",
    "track": "h-7 w-12",
    "thumbCheckedTranslate": "translate-x-7",
  },
  "2xl": {
    "thumb": "h-5 w-5",
    "track": "h-8 w-14",
    "thumbCheckedTranslate": "translate-x-8",
  },
  "md": {
    "track": "h-5 w-9",
    "thumb": "h-3.5 w-3.5",
    "thumbCheckedTranslate": "translate-x-4.5",
  },
  "2xs": {
    "track": "h-3 w-6",
    "thumb": "h-2.5 w-2.5",
    "thumbCheckedTranslate": "translate-x-2.5",
  },
};
