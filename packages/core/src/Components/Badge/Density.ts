// ** Local Imports
import type { BadgeSize } from "@core/Components/Badge/Size";
import { defaultSizeProps, miniSizeProps } from "@core/Components/Badge/Size";

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
