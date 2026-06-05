// ** Local Imports
import type { ButtonSize } from "@core/Components/Button/Size";
import { defaultSizeProps, miniSizeProps } from "@core/Components/Button/Size";

// prettier-ignore
export interface ButtonDensity {
  "default": ButtonSize;
  "mini": ButtonSize;
}

// prettier-ignore
export const densityProps: ButtonDensity = {
  "mini": miniSizeProps,
  "default": defaultSizeProps,
};
