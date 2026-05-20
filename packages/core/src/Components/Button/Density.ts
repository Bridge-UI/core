// ** Local Imports
import type { ButtonSize } from "@core/Components/Button/Size";
import { defaultSizeProps, miniSizeProps } from "@core/Components/Button/Size";

// prettier-ignore
export interface ButtonDensity {
  "mini": ButtonSize;
  "default": ButtonSize;
}

// prettier-ignore
export const densityProps: ButtonDensity = {
  "mini": miniSizeProps,
  "default": defaultSizeProps,
};
