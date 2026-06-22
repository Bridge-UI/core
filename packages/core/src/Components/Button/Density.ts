// ** Local Imports
import type { ButtonSize } from "@core/Components/Button/Size";
import { defaultSizeProps, miniSizeProps } from "@core/Components/Button/Size";

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
