// ** Local Imports
import type { ButtonSize } from "@/Components/Button/Size";
import { defaultSizeProps, miniSizeProps } from "@/Components/Button/Size";

export interface ButtonDensity {
  /**
   * Default density.
   */
  "default": ButtonSize;

  /**
   * Compact mini density.
   */
  "mini": ButtonSize;
}

export const densityProps: ButtonDensity = {
  "mini": miniSizeProps,
  "default": defaultSizeProps,
};
