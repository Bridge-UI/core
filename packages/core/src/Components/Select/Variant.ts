// ** Local Imports
import type { SelectColor } from "@core/Components/Select/Color";
import {
  filledProps,
  outlineProps,
  underlinedProps,
} from "@core/Components/Select/Color";

// prettier-ignore
export interface SelectVariant {
  "outline": SelectColor;
  "filled": SelectColor;
  "underlined": SelectColor;
}

// prettier-ignore
export const variantProps: SelectVariant = {
  "outline": outlineProps,
  "filled": filledProps,
  "underlined": underlinedProps,
};
