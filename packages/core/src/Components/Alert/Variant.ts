// ** Local Imports
import type { AlertColor } from "@core/Components/Alert/Color";
import {
  flatProps,
  outlineProps,
  solidProps,
} from "@core/Components/Alert/Color";

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
