// ** Local Imports
import type { ButtonColor } from "@core/Components/Button/Color";
import {
  flatProps,
  lightProps,
  outlineProps,
  solidProps,
} from "@core/Components/Button/Color";

export interface ButtonVariant {
  "flat": ButtonColor;
  "light": ButtonColor;
  "outline": ButtonColor;
  "solid": ButtonColor;
}

export const variantProps: ButtonVariant = {
  "flat": flatProps,
  "light": lightProps,
  "solid": solidProps,
  "outline": outlineProps,
};
