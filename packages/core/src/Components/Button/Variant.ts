// ** Local Imports
import type { ButtonColor } from "@core/Components/Button/Color";
import {
  flatProps,
  lightProps,
  outlineProps,
  solidProps,
} from "@core/Components/Button/Color";

export interface ButtonVariant {
  /**
   * Flat visual variant.
   */
  "flat": ButtonColor;

  /**
   * Light visual variant.
   */
  "light": ButtonColor;

  /**
   * Outline visual variant.
   */
  "outline": ButtonColor;

  /**
   * Solid visual variant.
   */
  "solid": ButtonColor;
}

export const variantProps: ButtonVariant = {
  "flat": flatProps,
  "light": lightProps,
  "solid": solidProps,
  "outline": outlineProps,
};
