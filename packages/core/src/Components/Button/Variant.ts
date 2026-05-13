// ** Local Imports
import type { ButtonColor } from "@core/Components/Button/Color";
import {
  flatProps,
  lightProps,
  outlineProps,
  solidProps,
} from "@core/Components/Button/Color";

// prettier-ignore
export interface ButtonVariant {
  "flat": ButtonColor;
  "light": ButtonColor;
  "solid": ButtonColor;
  "outline": ButtonColor;
}

// prettier-ignore
export const variantProps: ButtonVariant = {
  "flat": flatProps,
  "light": lightProps,
  "solid": solidProps,
  "outline": outlineProps,
};
