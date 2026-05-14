// ** Local Imports
import type { BadgeColor } from "@core/Components/Badge/Color";
import {
  flatProps,
  outlineProps,
  solidProps,
} from "@core/Components/Badge/Color";

// prettier-ignore
export interface BadgeVariant {
  "flat": BadgeColor;
  "solid": BadgeColor;
  "outline": BadgeColor;
}

// prettier-ignore
export const variantProps: BadgeVariant = {
  "flat": flatProps,
  "solid": solidProps,
  "outline": outlineProps,
};
