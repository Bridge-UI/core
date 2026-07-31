// ** Local Imports
import type { ButtonColor } from "@/Tokens/Button/Color";
import {
  flatProps,
  lightProps,
  outlineProps,
  solidProps,
} from "@/Tokens/Button/Color";

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
