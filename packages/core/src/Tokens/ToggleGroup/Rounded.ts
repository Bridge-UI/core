/**
 * Per-part radius classes for a toggle group `rounded` token.
 */
export interface ToggleGroupRoundedItem {
  /**
   * Radius for each segment chip.
   */
  "item": string;

  /**
   * Radius for the track shell.
   */
  "root": string;
}

/**
 * ToggleGroup border-radius scale.
 */
export interface ToggleGroupRounded {
  /**
   * Border radius classes for the `2xl` token.
   */
  "2xl": ToggleGroupRoundedItem;

  /**
   * Border radius classes for the `3xl` token.
   */
  "3xl": ToggleGroupRoundedItem;

  /**
   * Border radius classes for the `4xl` token.
   */
  "4xl": ToggleGroupRoundedItem;

  /**
   * Full / pill radius token (default).
   * Track uses `rounded-surface-full` (still reads as a pill at typical heights);
   * items keep a true `rounded-full` chip.
   */
  "full": ToggleGroupRoundedItem;

  /**
   * Border radius classes for the `lg` token.
   */
  "lg": ToggleGroupRoundedItem;

  /**
   * Border radius classes for the `md` token.
   */
  "md": ToggleGroupRoundedItem;

  /**
   * No radius.
   */
  "none": ToggleGroupRoundedItem;

  /**
   * Border radius classes for the `sm` token.
   */
  "sm": ToggleGroupRoundedItem;

  /**
   * Border radius classes for the `xl` token.
   */
  "xl": ToggleGroupRoundedItem;

  /**
   * Border radius classes for the `xs` token.
   */
  "xs": ToggleGroupRoundedItem;
}

/**
 * Default toggle group rounded class maps.
 */
export const roundedProps: ToggleGroupRounded = {
  "xs": {
    "item": "rounded-xs",
    "root": "rounded-xs",
  },
  "sm": {
    "item": "rounded-sm",
    "root": "rounded-sm",
  },
  "md": {
    "item": "rounded-md",
    "root": "rounded-md",
  },
  "lg": {
    "item": "rounded-lg",
    "root": "rounded-lg",
  },
  "xl": {
    "item": "rounded-xl",
    "root": "rounded-xl",
  },
  "2xl": {
    "item": "rounded-2xl",
    "root": "rounded-2xl",
  },
  "3xl": {
    "item": "rounded-3xl",
    "root": "rounded-3xl",
  },
  "4xl": {
    "item": "rounded-4xl",
    "root": "rounded-4xl",
  },
  "none": {
    "item": "rounded-none",
    "root": "rounded-none",
  },
  "full": {
    "item": "rounded-full",
    "root": "rounded-surface-full",
  },
};
