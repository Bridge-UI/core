// ** Local Imports
import type { TextInputColor } from "@core/Components/TextInput/Color";
import {
  filledProps,
  outlineProps,
  underlinedProps,
} from "@core/Components/TextInput/Color";

// prettier-ignore
export interface TextInputVariant {
  "outline": TextInputColor;
  "filled": TextInputColor;
  "underlined": TextInputColor;
}

// prettier-ignore
export const variantProps: TextInputVariant = {
  "outline": outlineProps,
  "filled": filledProps,
  "underlined": underlinedProps,
};
