// ** Local Imports
import { ButtonColor } from "@/Components/Button/props";
import {
  flatProps,
  lightProps,
  outlineProps,
  solidProps,
} from "@/Components/Button/props/Color";

export interface ButtonVariant {
  flat: ButtonColor;
  light: ButtonColor;
  solid: ButtonColor;
  outline: ButtonColor;
}

export const variantProps: ButtonVariant = {
  flat: flatProps,
  light: lightProps,
  solid: solidProps,
  outline: outlineProps,
};
