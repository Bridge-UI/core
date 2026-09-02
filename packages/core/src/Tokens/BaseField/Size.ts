export interface BaseFieldSizeItem {
  /**
   * Gap between start slot, control, and end slot.
   */
  "group": string;

  /**
   * Typography for description and error message below the group.
   * One step smaller than the Label scale so helper copy stays secondary.
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
    "text": "text-xs",
  },
  "lg": {
    "group": "gap-2",
    "text": "text-sm",
  },
  "xl": {
    "text": "text-sm",
    "group": "gap-2.5",
  },
  "2xl": {
    "group": "gap-3",
    "text": "text-base",
  },
  "xs": {
    "text": "text-2xs",
    "group": "gap-1.5",
  },
  "sm": {
    "text": "text-2xs",
    "group": "gap-1.5",
  },
  "2xs": {
    "text": "text-2xs",
    "group": "gap-1.5",
  },
};
