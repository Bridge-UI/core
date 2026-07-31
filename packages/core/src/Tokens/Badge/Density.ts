// ** Local Imports
import type { BadgeSize } from "@/Tokens/Badge/Size";
import { defaultSizeProps, miniSizeProps } from "@/Tokens/Badge/Size";

export interface BadgeDensity {
  /**
   * Default density.
   */
  "default": BadgeSize;

  /**
   * Compact mini density.
   */
  "mini": BadgeSize;
}

export const densityProps: BadgeDensity = {
  "mini": miniSizeProps,
  "default": defaultSizeProps,
};
