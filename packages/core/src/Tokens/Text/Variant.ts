// ** Local Imports
import type { TextColor } from "@/Tokens/Text/Color";
import { defaultProps, mutedProps } from "@/Tokens/Text/Color";

export interface TextVariant {
  /**
   * Main text tone (titles, values, body copy).
   */
  "default": TextColor;

  /**
   * Secondary text tone (subtitles, captions, metadata).
   */
  "muted": TextColor;
}

export const variantProps: TextVariant = {
  "muted": mutedProps,
  "default": defaultProps,
};
