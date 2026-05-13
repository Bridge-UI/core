// ** Local Imports
import type { AlertColor } from "@core/Components/Alert/Color";
import {
  flatProps,
  outlineProps,
  solidProps,
} from "@core/Components/Alert/Color";

// prettier-ignore
export interface AlertVariant {
  "flat": AlertColor;
  "solid": AlertColor;
  "outline": AlertColor;
}

// prettier-ignore
export const variantProps: AlertVariant = {
  "flat": flatProps,
  "solid": solidProps,
  "outline": outlineProps,
};
