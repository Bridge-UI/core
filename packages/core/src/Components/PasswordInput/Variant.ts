// ** Local Imports
import type { PasswordInputColor } from "@core/Components/PasswordInput/Color";
import {
  filledProps,
  outlineProps,
  underlinedProps,
} from "@core/Components/PasswordInput/Color";

// prettier-ignore
export interface PasswordInputVariant {
  "outline": PasswordInputColor;
  "filled": PasswordInputColor;
  "underlined": PasswordInputColor;
}

// prettier-ignore
export const variantProps: PasswordInputVariant = {
  "outline": outlineProps,
  "filled": filledProps,
  "underlined": underlinedProps,
};
