// ** Local Imports
import type { BadgeSize } from "@core/Components/Badge/Size";
import { defaultSizeProps, miniSizeProps } from "@core/Components/Badge/Size";

// prettier-ignore
export interface BadgeDensity {
  "mini": BadgeSize;
  "default": BadgeSize;
}

// prettier-ignore
export const densityProps: BadgeDensity = {
  "mini": miniSizeProps,
  "default": defaultSizeProps,
};
