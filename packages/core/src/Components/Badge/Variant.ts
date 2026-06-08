// ** Local Imports
import type { BadgeColor } from "@core/Components/Badge/Color";
import {
  flatProps,
  outlineProps,
  solidProps,
} from "@core/Components/Badge/Color";

export interface BadgeVariant {
  "flat": BadgeColor;
  "outline": BadgeColor;
  "solid": BadgeColor;
}

export const variantProps: BadgeVariant = {
  "flat": flatProps,
  "solid": solidProps,
  "outline": outlineProps,
};
