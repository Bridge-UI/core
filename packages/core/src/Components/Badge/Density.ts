// ** Local Imports
import type { BadgeSize } from "@/Components/Badge/Size";
import { defaultSizeProps, miniSizeProps } from "@/Components/Badge/Size";

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
