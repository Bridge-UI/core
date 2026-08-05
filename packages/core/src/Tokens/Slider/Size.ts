export interface SliderSizeItem {
  /**
   * Hit-area wrapper around the thumb.
   */
  "thumb": string;

  /**
   * Visible thumb knob classes.
   */
  "thumbKnob": string;

  /**
   * Track height plus the vertical space reserved for the knob and focus ring.
   */
  "track": string;
}

export interface SliderSize {
  /**
   * Size scale token `2xl`.
   */
  "2xl": SliderSizeItem;

  /**
   * Size scale token `2xs`.
   */
  "2xs": SliderSizeItem;

  /**
   * Size scale token `lg`.
   */
  "lg": SliderSizeItem;

  /**
   * Size scale token `md`.
   */
  "md": SliderSizeItem;

  /**
   * Size scale token `sm`.
   */
  "sm": SliderSizeItem;

  /**
   * Size scale token `xl`.
   */
  "xl": SliderSizeItem;

  /**
   * Size scale token `xs`.
   */
  "xs": SliderSizeItem;
}

export const sizeProps: SliderSize = {
  "xs": {
    "track": "h-1 my-2.5",
    "thumbKnob": "h-3 w-3",
    "thumb": "h-8 w-8 -top-3.5",
  },
  "md": {
    "track": "h-2 my-2.5",
    "thumbKnob": "h-4 w-4",
    "thumb": "h-9 w-9 -top-3.5",
  },
  "xl": {
    "track": "h-3 my-2.5",
    "thumbKnob": "h-5 w-5",
    "thumb": "h-11 w-11 -top-4",
  },
  "2xs": {
    "track": "h-1 my-2",
    "thumb": "h-7 w-7 -top-3",
    "thumbKnob": "h-2.5 w-2.5",
  },
  "2xl": {
    "track": "h-3.5 my-3",
    "thumbKnob": "h-6 w-6",
    "thumb": "h-12 w-12 -top-4.5",
  },
  "sm": {
    "track": "h-1.5 my-2.5",
    "thumb": "h-9 w-9 -top-4",
    "thumbKnob": "h-3.5 w-3.5",
  },
  "lg": {
    "track": "h-2.5 my-2.5",
    "thumbKnob": "h-4.5 w-4.5",
    "thumb": "h-10 w-10 -top-4",
  },
};
