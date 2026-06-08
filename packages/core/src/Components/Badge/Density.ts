// ** Local Imports
import type { BadgeSize } from "@core/Components/Badge/Size";
import { defaultSizeProps, miniSizeProps } from "@core/Components/Badge/Size";

export interface BadgeDensity {
  "default": BadgeSize;
  "mini": BadgeSize;
}

export const densityProps: BadgeDensity = {
  "mini": miniSizeProps,
  "default": defaultSizeProps,
};
