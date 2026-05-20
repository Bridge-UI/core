// ** Local Imports
import type { TextFieldColor } from "@core/Components/TextField/Color";
import {
  filledProps,
  outlineProps,
  underlinedProps,
} from "@core/Components/TextField/Color";

// prettier-ignore
export interface TextFieldVariant {
  "outline": TextFieldColor;
  "filled": TextFieldColor;
  "underlined": TextFieldColor;
}

// prettier-ignore
export const variantProps: TextFieldVariant = {
  "outline": outlineProps,
  "filled": filledProps,
  "underlined": underlinedProps,
};
