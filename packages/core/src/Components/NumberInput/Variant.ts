// ** Local Imports
import type { NumberInputColor } from "@core/Components/NumberInput/Color";
import {
  filledProps,
  outlineProps,
  underlinedProps,
} from "@core/Components/NumberInput/Color";

// prettier-ignore
export interface NumberInputVariant {
  "outline": NumberInputColor;
  "filled": NumberInputColor;
  "underlined": NumberInputColor;
}

// prettier-ignore
export const variantProps: NumberInputVariant = {
  "outline": outlineProps,
  "filled": filledProps,
  "underlined": underlinedProps,
};
