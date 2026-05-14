// ** Local Imports
import type { TextareaColor } from "@core/Components/Textarea/Color";
import {
  filledProps,
  outlineProps,
  underlinedProps,
} from "@core/Components/Textarea/Color";

// prettier-ignore
export interface TextareaVariant {
  "outline": TextareaColor;
  "filled": TextareaColor;
  "underlined": TextareaColor;
}

// prettier-ignore
export const variantProps: TextareaVariant = {
  "outline": outlineProps,
  "filled": filledProps,
  "underlined": underlinedProps,
};
