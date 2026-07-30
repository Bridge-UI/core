// ** Local Imports
import type { AlertColor } from "@/Tokens/Alert/Color";
import { flatProps, outlineProps, solidProps } from "@/Tokens/Alert/Color";

export interface AlertVariant {
  /**
   * Flat visual variant.
   */
  "flat": AlertColor;

  /**
   * Outline visual variant.
   */
  "outline": AlertColor;

  /**
   * Solid visual variant.
   */
  "solid": AlertColor;
}

export const variantProps: AlertVariant = {
  "flat": flatProps,
  "solid": solidProps,
  "outline": outlineProps,
};
