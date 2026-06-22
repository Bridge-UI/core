// ** Local Imports
import type { BadgeColor } from "@/Components/Badge/Color";
import { flatProps, outlineProps, solidProps } from "@/Components/Badge/Color";

export interface BadgeVariant {
  /**
   * Flat visual variant.
   */
  "flat": BadgeColor;

  /**
   * Outline visual variant.
   */
  "outline": BadgeColor;

  /**
   * Solid visual variant.
   */
  "solid": BadgeColor;
}

export const variantProps: BadgeVariant = {
  "flat": flatProps,
  "solid": solidProps,
  "outline": outlineProps,
};
