// ** Local Imports
import type { SelectColor } from "@core/Components/Select/Color";
import {
  filledProps,
  outlineProps,
  underlinedProps,
} from "@core/Components/Select/Color";

// prettier-ignore
export interface SelectVariant {
  "filled": SelectColor;
  "outline": SelectColor;
  "underlined": SelectColor;
}

// prettier-ignore
export const variantProps: SelectVariant = {
  "filled": filledProps,
  "outline": outlineProps,
  "underlined": underlinedProps,
};
