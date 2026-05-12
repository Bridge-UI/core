// ** Local Imports
import type { AlertColor } from "@/Components/Alert/props";
import {
  flatProps,
  outlineProps,
  solidProps,
} from "@/Components/Alert/props/Color";

export interface AlertVariant {
  flat: AlertColor;
  solid: AlertColor;
  outline: AlertColor;
}

export const variantProps: AlertVariant = {
  flat: flatProps,
  solid: solidProps,
  outline: outlineProps,
};
