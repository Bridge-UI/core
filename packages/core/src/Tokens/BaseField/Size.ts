export interface BaseFieldSizeItem {
  /**
   * Gap between start slot, control, and end slot.
   */
  "group": string;

  /**
   * Typography for label, corner, description, and error message.
   */
  "text": string;
}

export interface BaseFieldSize {
  /**
   * Size scale token `2xl`.
   */
  "2xl": BaseFieldSizeItem;

  /**
   * Size scale token `2xs`.
   */
  "2xs": BaseFieldSizeItem;

  /**
   * Size scale token `lg`.
   */
  "lg": BaseFieldSizeItem;

  /**
   * Size scale token `md`.
   */
  "md": BaseFieldSizeItem;

  /**
   * Size scale token `sm`.
   */
  "sm": BaseFieldSizeItem;

  /**
   * Size scale token `xl`.
   */
  "xl": BaseFieldSizeItem;

  /**
   * Size scale token `xs`.
   */
  "xs": BaseFieldSizeItem;
}

export const sizeProps: BaseFieldSize = {
  "md": {
    "group": "gap-2",
    "text": "text-sm",
  },
  "2xl": {
    "group": "gap-3",
    "text": "text-lg",
  },
  "xs": {
    "text": "text-xs",
    "group": "gap-1.5",
  },
  "sm": {
    "text": "text-xs",
    "group": "gap-1.5",
  },
  "lg": {
    "group": "gap-2",
    "text": "text-base",
  },
  "2xs": {
    "text": "text-xs",
    "group": "gap-1.5",
  },
  "xl": {
    "group": "gap-2.5",
    "text": "text-base",
  },
};
