// ** Local Imports
import type { AlertColor } from "@core/Components/Alert/Color";
import {
  flatProps,
  outlineProps,
  solidProps,
} from "@core/Components/Alert/Color";

export interface AlertVariant {
  "flat": AlertColor;
  "outline": AlertColor;
  "solid": AlertColor;
}

export const variantProps: AlertVariant = {
  "flat": flatProps,
  "solid": solidProps,
  "outline": outlineProps,
};
